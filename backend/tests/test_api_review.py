"""Tests for Review API endpoints."""
import pytest
import unittest.mock
from fastapi.testclient import TestClient
from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine
from datetime import datetime

from backend.api.review import router, get_review_service
from backend.db import get_session
from backend.models import WordDefinition, ChunkRead, PhraseExplanation
from backend.exceptions.review_exceptions import (
    WordlistNotFoundError,
    ChunksNotFoundError
)


@pytest.fixture
def app():
    """Create a test FastAPI app."""
    app = FastAPI()
    app.include_router(router, prefix="/api")
    return app


@pytest.fixture
def client(app):
    """Create a test client."""
    return TestClient(app)


@pytest.fixture
def test_engine():
    """Create in-memory SQLite engine for testing."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture
def test_session(test_engine):
    """Create test database session."""
    with Session(test_engine) as session:
        yield session


@pytest.fixture
def override_dependencies(app):
    """Override FastAPI dependencies for testing."""
    def cleanup():
        app.dependency_overrides = {}
    
    yield cleanup
    cleanup()


class TestReviewEndpoints:
    """Test cases for Review API endpoints."""

    def test_get_wordlist_success(self, app, client, test_session, override_dependencies):
        """Test successful wordlist retrieval."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_wordlist = [
            WordDefinition(
                id=1,
                word="example",
                context="This is an example sentence.",
                definition="A representative case",
                definition_with_context="In this context, example refers to a sample case",
                created_at=datetime.now(),
                meta_text_id=1
            ),
            WordDefinition(
                id=2,
                word="test",
                context="This is a test.",
                definition="A procedure to check something",
                definition_with_context="In this context, test means verification",
                created_at=datetime.now(),
                meta_text_id=1
            )
        ]
        mock_service.get_wordlist_for_meta_text.return_value = mock_wordlist
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/wordlist")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 2
        assert result[0]["word"] == "example"
        assert result[1]["word"] == "test"
        mock_service.get_wordlist_for_meta_text.assert_called_once_with(1, unittest.mock.ANY)

    def test_get_wordlist_not_found(self, app, client, test_session, override_dependencies):
        """Test wordlist retrieval when no words found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.get_wordlist_for_meta_text.side_effect = WordlistNotFoundError(1)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/wordlist")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Wordlist not found for the specified meta-text."

    def test_get_chunk_summaries_notes_success(self, app, client, test_session, override_dependencies):
        """Test successful chunk summaries and notes retrieval."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_chunks = [
            ChunkRead(
                id=1,
                text="First chunk text",
                position=1.0,
                notes="First chunk notes",
                summary="First chunk summary",
                comparison="",
                meta_text_id=1
            ),
            ChunkRead(
                id=2,
                text="Second chunk text",
                position=2.0,
                notes="Second chunk notes",
                summary="Second chunk summary",
                comparison="",
                meta_text_id=1
            )
        ]
        mock_service.get_chunk_summaries_and_notes.return_value = mock_chunks
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/chunk-summaries-notes")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 2
        assert result[0]["text"] == "First chunk text"
        assert result[1]["text"] == "Second chunk text"
        mock_service.get_chunk_summaries_and_notes.assert_called_once_with(1, unittest.mock.ANY)

    def test_get_chunk_summaries_notes_not_found(self, app, client, test_session, override_dependencies):
        """Test chunk summaries retrieval when no chunks found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.get_chunk_summaries_and_notes.side_effect = ChunksNotFoundError(1)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/chunk-summaries-notes")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Chunks not found for the specified meta-text."

    def test_get_wordlist_summary_success(self, app, client, test_session, override_dependencies):
        """Test successful wordlist summary retrieval."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_summary = {
            "meta_text_id": 1,
            "total_words": 10,
            "unique_words": 8,
            "most_recent_word": "example"
        }
        mock_service.get_wordlist_summary.return_value = mock_summary
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/wordlist-summary")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["meta_text_id"] == 1
        assert result["total_words"] == 10
        assert result["unique_words"] == 8
        assert result["most_recent_word"] == "example"
        mock_service.get_wordlist_summary.assert_called_once_with(1, unittest.mock.ANY)

    def test_get_wordlist_summary_empty(self, app, client, test_session, override_dependencies):
        """Test wordlist summary when no words exist."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_summary = {
            "meta_text_id": 1,
            "total_words": 0,
            "unique_words": 0,
            "most_recent_word": None
        }
        mock_service.get_wordlist_summary.return_value = mock_summary
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/wordlist-summary")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["meta_text_id"] == 1
        assert result["total_words"] == 0
        assert result["unique_words"] == 0
        assert result["most_recent_word"] is None

    def test_get_chunks_summary_success(self, app, client, test_session, override_dependencies):
        """Test successful chunks summary retrieval."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_summary = {
            "meta_text_id": 1,
            "total_chunks": 5,
            "chunks_with_summaries": 3,
            "chunks_with_notes": 2,
            "chunks_with_comparison": 1,
            "completion_percentage": {
                "summaries": 60.0,
                "notes": 40.0,
                "comparison": 20.0
            }
        }
        mock_service.get_chunks_summary.return_value = mock_summary
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/chunks-summary")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["meta_text_id"] == 1
        assert result["total_chunks"] == 5
        assert result["chunks_with_summaries"] == 3
        assert result["completion_percentage"]["summaries"] == 60.0
        mock_service.get_chunks_summary.assert_called_once_with(1, unittest.mock.ANY)

    def test_get_chunks_summary_empty(self, app, client, test_session, override_dependencies):
        """Test chunks summary when no chunks exist."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_summary = {
            "meta_text_id": 1,
            "total_chunks": 0,
            "chunks_with_summaries": 0,
            "chunks_with_notes": 0,
            "chunks_with_comparison": 0,
            "completion_percentage": {
                "summaries": 0,
                "notes": 0,
                "comparison": 0
            }
        }
        mock_service.get_chunks_summary.return_value = mock_summary
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/chunks-summary")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["meta_text_id"] == 1
        assert result["total_chunks"] == 0
        assert result["completion_percentage"]["summaries"] == 0

    def test_get_phrase_explanations_success(self, app, client, test_session, override_dependencies):
        """Test successful phrase explanations retrieval."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_explanations = [
            PhraseExplanation(
                id=1,
                phrase="test phrase",
                context="This is a test context.",
                explanation="This is a test phrase explanation",
                explanation_with_context="In this context, test phrase means something specific",
                meta_text_id=1
            ),
            PhraseExplanation(
                id=2,
                phrase="another phrase",
                context="Another context for testing.",
                explanation="Another explanation",
                explanation_with_context="In this context, another phrase has a different meaning",
                meta_text_id=1
            )
        ]
        mock_service.get_phrase_explanations.return_value = mock_explanations
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/phrase-explanations")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 2
        assert result[0]["phrase"] == "test phrase"
        assert result[1]["phrase"] == "another phrase"
        mock_service.get_phrase_explanations.assert_called_once_with(1, unittest.mock.ANY)

    def test_get_phrase_explanations_empty(self, app, client, test_session, override_dependencies):
        """Test phrase explanations retrieval when none exist."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.get_phrase_explanations.return_value = []
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/phrase-explanations")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 0

    def test_get_wordlist_large_dataset(self, app, client, test_session, override_dependencies):
        """Test wordlist retrieval with large dataset."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_wordlist = [
            WordDefinition(
                id=i,
                word=f"word_{i}",
                context=f"Context for word {i}",
                definition=f"Definition {i}",
                definition_with_context=f"Contextual definition {i}",
                created_at=datetime.now(),
                meta_text_id=1
            ) for i in range(1, 101)  # 100 words
        ]
        mock_service.get_wordlist_for_meta_text.return_value = mock_wordlist
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/wordlist")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 100

    def test_endpoints_with_zero_metatext_id(self, app, client, test_session, override_dependencies):
        """Test endpoints with zero meta-text ID."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.get_wordlist_for_meta_text.side_effect = WordlistNotFoundError(0)
        mock_service.get_chunk_summaries_and_notes.side_effect = ChunksNotFoundError(0)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute - Test all endpoints with ID 0
        wordlist_response = client.get("/api/metatext/0/wordlist")
        chunks_response = client.get("/api/metatext/0/chunk-summaries-notes")

        # Assert
        assert wordlist_response.status_code == 404
        assert chunks_response.status_code == 404

    def test_endpoints_with_negative_metatext_id(self, app, client, test_session, override_dependencies):
        """Test endpoints with negative meta-text ID."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.get_wordlist_for_meta_text.side_effect = WordlistNotFoundError(-1)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/-1/wordlist")

        # Assert
        assert response.status_code == 404

    def test_endpoints_with_invalid_metatext_id(self, client):
        """Test endpoints with invalid meta-text ID."""
        # Execute - Test with non-numeric ID
        response = client.get("/api/metatext/invalid/wordlist")

        # Assert
        assert response.status_code == 422  # Validation error

    def test_wordlist_with_special_characters(self, app, client, test_session, override_dependencies):
        """Test wordlist with special characters in words."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_wordlist = [
            WordDefinition(
                id=1,
                word="café",
                context="The café was busy.",
                definition="A place to drink coffee",
                definition_with_context="In this context, café refers to a coffee shop",
                created_at=datetime.now(),
                meta_text_id=1
            ),
            WordDefinition(
                id=2,
                word="naïve",
                context="He was naïve about it.",
                definition="Lacking experience",
                definition_with_context="In this context, naïve means inexperienced",
                created_at=datetime.now(),
                meta_text_id=1
            )
        ]
        mock_service.get_wordlist_for_meta_text.return_value = mock_wordlist
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/wordlist")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result[0]["word"] == "café"
        assert result[1]["word"] == "naïve"

    def test_chunks_with_unicode_content(self, app, client, test_session, override_dependencies):
        """Test chunks with Unicode content."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_chunks = [
            ChunkRead(
                id=1,
                text="This contains Unicode: café, naïve, résumé",
                position=1.0,
                notes="Notes with émojis: 😀 📚",
                summary="Summary with accents: résumé",
                comparison="",
                meta_text_id=1
            )
        ]
        mock_service.get_chunk_summaries_and_notes.return_value = mock_chunks
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1/chunk-summaries-notes")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert "café" in result[0]["text"]
        assert "😀" in result[0]["notes"]

    def test_concurrent_requests_same_metatext(self, app, client, test_session, override_dependencies):
        """Test multiple concurrent requests for same meta-text."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_wordlist = [WordDefinition(id=1, word="test", context="context", definition="def", definition_with_context="ctx", created_at=datetime.now(), meta_text_id=1)]
        mock_service.get_wordlist_for_meta_text.return_value = mock_wordlist
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute multiple requests
        responses = []
        for _ in range(5):
            response = client.get("/api/metatext/1/wordlist")
            responses.append(response)

        # Assert all succeeded
        for response in responses:
            assert response.status_code == 200
            assert len(response.json()) == 1

    def test_summary_endpoints_consistency(self, app, client, test_session, override_dependencies):
        """Test that summary endpoints return consistent structure."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_wordlist_summary = {
            "meta_text_id": 1,
            "total_words": 5,
            "unique_words": 4,
            "most_recent_word": "test"
        }
        mock_chunks_summary = {
            "meta_text_id": 1,
            "total_chunks": 3,
            "chunks_with_summaries": 2,
            "chunks_with_notes": 1,
            "chunks_with_comparison": 0,
            "completion_percentage": {
                "summaries": 66.67,
                "notes": 33.33,
                "comparison": 0.0
            }
        }
        mock_service.get_wordlist_summary.return_value = mock_wordlist_summary
        mock_service.get_chunks_summary.return_value = mock_chunks_summary
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_review_service] = lambda: mock_service

        # Execute
        wordlist_response = client.get("/api/metatext/1/wordlist-summary")
        chunks_response = client.get("/api/metatext/1/chunks-summary")

        # Assert
        assert wordlist_response.status_code == 200
        assert chunks_response.status_code == 200
        
        wordlist_result = wordlist_response.json()
        chunks_result = chunks_response.json()
        
        # Both should have meta_text_id
        assert wordlist_result["meta_text_id"] == 1
        assert chunks_result["meta_text_id"] == 1
        
        # Validate structure
        assert "total_words" in wordlist_result
        assert "total_chunks" in chunks_result
        assert "completion_percentage" in chunks_result
