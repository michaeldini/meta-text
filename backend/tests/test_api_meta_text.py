"""Tests for MetaText API endpoints."""
import pytest
import unittest.mock
from fastapi.testclient import TestClient
from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine

from backend.api.meta_text import router, get_meta_text_service
from backend.db import get_session
from backend.models import MetaTextSummary, MetaTextDetail, ChunkRead
from backend.exceptions.meta_text_exceptions import (
    SourceDocumentNotFoundError,
    MetaTextNotFoundError,
    MetaTextTitleExistsError,
    MetaTextCreationError
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


class TestMetaTextEndpoints:
    """Test cases for MetaText API endpoints."""

    def test_create_meta_text_success(self, app, client, test_session, override_dependencies):
        """Test successful meta-text creation."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_meta_text = MetaTextSummary(
            id=1,
            title="Test Meta Text",
            source_document_id=1
        )
        mock_service.create_meta_text_with_chunks.return_value = mock_meta_text
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_meta_text_service] = lambda: mock_service

        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": 1
        }

        # Execute
        response = client.post("/api/meta-text", json=request_data)

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["id"] == 1
        assert result["title"] == "Test Meta Text"
        assert result["source_document_id"] == 1
        mock_service.create_meta_text_with_chunks.assert_called_once_with(
            title="Test Meta Text",
            source_doc_id=1,
            session=unittest.mock.ANY
        )

    def test_create_meta_text_source_doc_not_found(self, app, client, test_session, override_dependencies):
        """Test meta-text creation when source document not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.create_meta_text_with_chunks.side_effect = SourceDocumentNotFoundError(999)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_meta_text_service] = lambda: mock_service

        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": 999
        }

        # Execute
        response = client.post("/api/meta-text", json=request_data)

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Source document not found."

    def test_create_meta_text_title_exists(self, app, client, test_session, override_dependencies):
        """Test meta-text creation when title already exists."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.create_meta_text_with_chunks.side_effect = MetaTextTitleExistsError("Test Meta Text")
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_meta_text_service] = lambda: mock_service

        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": 1
        }

        # Execute
        response = client.post("/api/meta-text", json=request_data)

        # Assert
        assert response.status_code == 409
        assert response.json()["detail"] == "Meta-text title already exists."

    def test_create_meta_text_creation_error(self, app, client, test_session, override_dependencies):
        """Test meta-text creation with internal error."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.create_meta_text_with_chunks.side_effect = MetaTextCreationError("Database error")
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_meta_text_service] = lambda: mock_service

        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": 1
        }

        # Execute
        response = client.post("/api/meta-text", json=request_data)

        # Assert
        assert response.status_code == 500
        assert "Database error" in response.json()["detail"]

    def test_list_meta_texts_success(self, app, client, test_session, override_dependencies):
        """Test successful meta-texts listing."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_meta_texts = [
            MetaTextSummary(id=1, title="First Meta Text", source_document_id=1),
            MetaTextSummary(id=2, title="Second Meta Text", source_document_id=1),
            MetaTextSummary(id=3, title="Third Meta Text", source_document_id=2)
        ]
        mock_service.list_all_meta_texts.return_value = mock_meta_texts
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_meta_text_service] = lambda: mock_service

        # Execute
        response = client.get("/api/meta-text")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 3
        assert result[0]["title"] == "First Meta Text"
        assert result[1]["title"] == "Second Meta Text"
        assert result[2]["title"] == "Third Meta Text"
        mock_service.list_all_meta_texts.assert_called_once_with(unittest.mock.ANY)

    def test_list_meta_texts_empty(self, app, client, test_session, override_dependencies):
        """Test meta-texts listing when no meta-texts exist."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.list_all_meta_texts.return_value = []
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_meta_text_service] = lambda: mock_service

        # Execute
        response = client.get("/api/meta-text")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 0

    def test_get_meta_text_success(self, app, client, test_session, override_dependencies):
        """Test successful meta-text retrieval."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_meta_text = MetaTextDetail(
            id=1,
            title="Test Meta Text",
            source_document_id=1,
            text="Full meta text content",
            chunks=[
                ChunkRead(id=1, text="Chunk 1 text", meta_text_id=1),
                ChunkRead(id=2, text="Chunk 2 text", meta_text_id=1)
            ]
        )
        mock_service.get_meta_text_by_id.return_value = mock_meta_text
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_meta_text_service] = lambda: mock_service

        # Execute
        response = client.get("/api/meta-text/1")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["id"] == 1
        assert result["title"] == "Test Meta Text"
        mock_service.get_meta_text_by_id.assert_called_once_with(1, unittest.mock.ANY)

    def test_get_meta_text_not_found(self, app, client, test_session, override_dependencies):
        """Test meta-text retrieval when not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.get_meta_text_by_id.side_effect = MetaTextNotFoundError(999)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_meta_text_service] = lambda: mock_service

        # Execute
        response = client.get("/api/meta-text/999")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Meta-text not found."

    def test_delete_meta_text_success(self, app, client, test_session, override_dependencies):
        """Test successful meta-text deletion."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.delete_meta_text.return_value = {"message": "Meta-text deleted successfully"}
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_meta_text_service] = lambda: mock_service

        # Execute
        response = client.delete("/api/meta-text/1")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert "message" in result
        mock_service.delete_meta_text.assert_called_once_with(1, unittest.mock.ANY)

    def test_delete_meta_text_not_found(self, app, client, test_session, override_dependencies):
        """Test meta-text deletion when not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.delete_meta_text.side_effect = MetaTextNotFoundError(999)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_meta_text_service] = lambda: mock_service

        # Execute
        response = client.delete("/api/meta-text/999")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Meta-text not found."

    def test_create_meta_text_validation_missing_title(self, client):
        """Test meta-text creation with missing title."""
        request_data = {
            "sourceDocId": 1
        }

        # Execute
        response = client.post("/api/meta-text", json=request_data)

        # Assert
        assert response.status_code == 422  # Validation error

    def test_create_meta_text_validation_missing_source_doc_id(self, client):
        """Test meta-text creation with missing source document ID."""
        request_data = {
            "title": "Test Meta Text"
        }

        # Execute
        response = client.post("/api/meta-text", json=request_data)

        # Assert
        assert response.status_code == 422  # Validation error

    def test_create_meta_text_validation_empty_title(self, app, client, test_session, override_dependencies):
        """Test meta-text creation with empty title."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_meta_text = MetaTextSummary(
            id=1,
            title="",
            source_document_id=1
        )
        mock_service.create_meta_text_with_chunks.return_value = mock_meta_text
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_meta_text_service] = lambda: mock_service

        request_data = {
            "title": "",
            "sourceDocId": 1
        }

        # Execute
        response = client.post("/api/meta-text", json=request_data)

        # Assert
        assert response.status_code == 200  # Should be allowed - empty string validation handled by service

    def test_create_meta_text_validation_invalid_source_doc_id(self, client):
        """Test meta-text creation with invalid source document ID."""
        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": "invalid"
        }

        # Execute
        response = client.post("/api/meta-text", json=request_data)

        # Assert
        assert response.status_code == 422  # Validation error

    def test_get_meta_text_invalid_id(self, client):
        """Test meta-text retrieval with invalid ID."""
        # Execute
        response = client.get("/api/meta-text/invalid")

        # Assert
        assert response.status_code == 422  # Validation error

    def test_delete_meta_text_invalid_id(self, client):
        """Test meta-text deletion with invalid ID."""
        # Execute
        response = client.delete("/api/meta-text/invalid")

        # Assert
        assert response.status_code == 422  # Validation error
