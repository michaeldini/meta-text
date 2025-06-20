"""Tests for Review API endpoints."""
import pytest
import unittest.mock
from unittest.mock import patch
from fastapi.testclient import TestClient
from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine
from datetime import datetime

from backend.api.review import router
from backend.models import WordDefinition, ChunkRead
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


class TestReviewEndpoints:
    """Test cases for Review API endpoints."""

    @patch('backend.api.review.get_session')
    @patch('backend.api.review.review_service')
    def test_get_wordlist_success(self, mock_service, mock_get_session, client, test_session):
        """Test successful wordlist retrieval."""
        # Setup
        mock_get_session.return_value = test_session
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

        # Execute
        response = client.get("/api/metatext/1/wordlist")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 2
        assert result[0]["word"] == "example"
        assert result[1]["word"] == "test"
        mock_service.get_wordlist_for_meta_text.assert_called_once_with(1, unittest.mock.ANY)

    @patch('backend.api.review.get_session')
    @patch('backend.api.review.review_service')
    def test_get_wordlist_not_found(self, mock_service, mock_get_session, client, test_session):
        """Test wordlist retrieval when no words found."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.get_wordlist_for_meta_text.side_effect = WordlistNotFoundError(1)

        # Execute
        response = client.get("/api/metatext/1/wordlist")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "No words found in the wordlist for this metatext"

    @patch('backend.api.review.get_session')
    @patch('backend.api.review.review_service')
    def test_get_chunk_summaries_notes_success(self, mock_service, mock_get_session, client, test_session):
        """Test successful chunk summaries and notes retrieval."""
        # Setup
        mock_get_session.return_value = test_session
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

        # Execute
        response = client.get("/api/metatext/1/chunk-summaries-notes")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 2
        assert result[0]["notes"] == "First chunk notes"
        assert result[0]["summary"] == "First chunk summary"
        assert result[1]["notes"] == "Second chunk notes"
        assert result[1]["summary"] == "Second chunk summary"
        mock_service.get_chunk_summaries_and_notes.assert_called_once_with(1, unittest.mock.ANY)

    @patch('backend.api.review.get_session')
    @patch('backend.api.review.review_service')
    def test_get_chunk_summaries_notes_not_found(self, mock_service, mock_get_session, client, test_session):
        """Test chunk summaries and notes retrieval when no chunks found."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.get_chunk_summaries_and_notes.side_effect = ChunksNotFoundError(1)

        # Execute
        response = client.get("/api/metatext/1/chunk-summaries-notes")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "No chunks found for this metatext"

    @patch('backend.api.review.get_session')
    @patch('backend.api.review.review_service')
    def test_get_wordlist_summary_success(self, mock_service, mock_get_session, client, test_session):
        """Test successful wordlist summary retrieval."""
        # Setup
        mock_get_session.return_value = test_session
        mock_summary = {
            "total_words": 15,
            "unique_words": 12,
            "most_common_words": ["the", "and", "of"],
            "recent_additions": 3
        }
        mock_service.get_wordlist_summary.return_value = mock_summary

        # Execute
        response = client.get("/api/metatext/1/wordlist-summary")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["total_words"] == 15
        assert result["unique_words"] == 12
        assert len(result["most_common_words"]) == 3
        mock_service.get_wordlist_summary.assert_called_once_with(1, unittest.mock.ANY)

    @patch('backend.api.review.get_session')
    @patch('backend.api.review.review_service')
    def test_get_wordlist_summary_empty(self, mock_service, mock_get_session, client, test_session):
        """Test wordlist summary when no data available."""
        # Setup
        mock_get_session.return_value = test_session
        mock_summary = {
            "total_words": 0,
            "unique_words": 0,
            "most_common_words": [],
            "recent_additions": 0
        }
        mock_service.get_wordlist_summary.return_value = mock_summary

        # Execute
        response = client.get("/api/metatext/1/wordlist-summary")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["total_words"] == 0
        assert result["unique_words"] == 0
        assert len(result["most_common_words"]) == 0

    @patch('backend.api.review.get_session')
    @patch('backend.api.review.review_service')
    def test_get_chunks_summary_success(self, mock_service, mock_get_session, client, test_session):
        """Test successful chunks summary retrieval."""
        # Setup
        mock_get_session.return_value = test_session
        mock_summary = {
            "total_chunks": 10,
            "chunks_with_notes": 7,
            "chunks_with_summaries": 8,
            "chunks_with_comparisons": 5,
            "completion_percentage": 75.0
        }
        mock_service.get_chunks_summary.return_value = mock_summary

        # Execute
        response = client.get("/api/metatext/1/chunks-summary")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["total_chunks"] == 10
        assert result["chunks_with_notes"] == 7
        assert result["chunks_with_summaries"] == 8
        assert result["completion_percentage"] == 75.0
        mock_service.get_chunks_summary.assert_called_once_with(1, unittest.mock.ANY)

    @patch('backend.api.review.get_session')
    @patch('backend.api.review.review_service')
    def test_get_chunks_summary_empty(self, mock_service, mock_get_session, client, test_session):
        """Test chunks summary when no chunks exist."""
        # Setup
        mock_get_session.return_value = test_session
        mock_summary = {
            "total_chunks": 0,
            "chunks_with_notes": 0,
            "chunks_with_summaries": 0,
            "chunks_with_comparisons": 0,
            "completion_percentage": 0.0
        }
        mock_service.get_chunks_summary.return_value = mock_summary

        # Execute
        response = client.get("/api/metatext/1/chunks-summary")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["total_chunks"] == 0
        assert result["completion_percentage"] == 0.0

    def test_get_wordlist_invalid_metatext_id(self, client):
        """Test wordlist retrieval with invalid meta-text ID."""
        # Execute
        response = client.get("/api/metatext/invalid/wordlist")

        # Assert
        assert response.status_code == 422  # Validation error

    def test_get_chunk_summaries_notes_invalid_metatext_id(self, client):
        """Test chunk summaries retrieval with invalid meta-text ID."""
        # Execute
        response = client.get("/api/metatext/invalid/chunk-summaries-notes")

        # Assert
        assert response.status_code == 422  # Validation error

    def test_get_wordlist_summary_invalid_metatext_id(self, client):
        """Test wordlist summary retrieval with invalid meta-text ID."""
        # Execute
        response = client.get("/api/metatext/invalid/wordlist-summary")

        # Assert
        assert response.status_code == 422  # Validation error

    def test_get_chunks_summary_invalid_metatext_id(self, client):
        """Test chunks summary retrieval with invalid meta-text ID."""
        # Execute
        response = client.get("/api/metatext/invalid/chunks-summary")

        # Assert
        assert response.status_code == 422  # Validation error

    @patch('backend.api.review.get_session')
    @patch('backend.api.review.review_service')
    def test_get_wordlist_large_dataset(self, mock_service, mock_get_session, client, test_session):
        """Test wordlist retrieval with large dataset."""
        # Setup
        mock_get_session.return_value = test_session
        # Create a large wordlist
        mock_wordlist = []
        for i in range(100):
            mock_wordlist.append(
                WordDefinition(
                    id=i+1,
                    word=f"word{i}",
                    context=f"Context for word{i}",
                    definition=f"Definition for word{i}",
                    definition_with_context=f"Contextual definition for word{i}",
                    created_at=datetime.now(),
                    meta_text_id=1
                )
            )
        mock_service.get_wordlist_for_meta_text.return_value = mock_wordlist

        # Execute
        response = client.get("/api/metatext/1/wordlist")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 100

    @patch('backend.api.review.get_session')
    @patch('backend.api.review.review_service')
    def test_endpoints_with_zero_metatext_id(self, mock_service, mock_get_session, client, test_session):
        """Test endpoints with zero meta-text ID."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.get_wordlist_for_meta_text.side_effect = WordlistNotFoundError(0)

        # Execute
        response = client.get("/api/metatext/0/wordlist")

        # Assert
        assert response.status_code == 404
