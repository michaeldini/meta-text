"""Tests for MetaText API endpoints."""
import pytest
import unittest.mock
from fastapi.testclient import TestClient
from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine

from backend.api.metatext import router, get_metatext_service
from backend.db import get_session
from backend.models import MetaTextSummary, MetaTextDetail, ChunkRead
from backend.exceptions.metatext_exceptions import (
    SourceDocumentNotFoundError,
    MetatextNotFoundError,
    MetatextTitleExistsError,
    MetatextCreationError
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


class TestMetatextEndpoints:
    """Test cases for Metatext API endpoints."""

    def test_create_metatext_success(self, app, client, test_session, override_dependencies):
        """Test successful metatext creation."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_metatext = MetaTextSummary(
            id=1,
            title="Test Meta Text",
            source_document_id=1,
            user_id=1
        )
        mock_service.create_metatext_with_chunks.return_value = mock_metatext
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_metatext_service] = lambda: mock_service

        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": 1
        }

        # Execute
        response = client.post("/api/metatext", json=request_data)

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["id"] == 1
        assert result["title"] == "Test Meta Text"
        assert result["source_document_id"] == 1
        mock_service.create_metatext_with_chunks.assert_called_once_with(
            title="Test Meta Text",
            source_doc_id=1,
            session=unittest.mock.ANY
        )

    def test_create_metatext_source_doc_not_found(self, app, client, test_session, override_dependencies):
        """Test metatext creation when source document not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.create_metatext_with_chunks.side_effect = SourceDocumentNotFoundError(999)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_metatext_service] = lambda: mock_service

        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": 999
        }

        # Execute
        response = client.post("/api/metatext", json=request_data)

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Source document not found."

    def test_create_metatext_title_exists(self, app, client, test_session, override_dependencies):
        """Test metatext creation when title already exists."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.create_metatext_with_chunks.side_effect = MetatextTitleExistsError("Test Meta Text")
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_metatext_service] = lambda: mock_service

        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": 1
        }

        # Execute
        response = client.post("/api/metatext", json=request_data)

        # Assert
        assert response.status_code == 409
        assert response.json()["detail"] == "Meta-text title already exists."

    def test_create_metatext_creation_error(self, app, client, test_session, override_dependencies):
        """Test metatext creation with internal error."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.create_metatext_with_chunks.side_effect = MetatextCreationError("Database error")
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_metatext_service] = lambda: mock_service

        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": 1
        }

        # Execute
        response = client.post("/api/metatext", json=request_data)

        # Assert
        assert response.status_code == 500
        assert "Database error" in response.json()["detail"]

    def test_list_metatexts_success(self, app, client, test_session, override_dependencies):
        """Test successful metatexts listing."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_metatexts = [
            MetaTextSummary(id=1, title="First Meta Text", source_document_id=1, user_id=1),
            MetaTextSummary(id=2, title="Second Meta Text", source_document_id=1, user_id=1),
            MetaTextSummary(id=3, title="Third Meta Text", source_document_id=2, user_id=2)
        ]
        mock_service.list_all_metatexts.return_value = mock_metatexts
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_metatext_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 3
        assert result[0]["title"] == "First Meta Text"
        assert result[1]["title"] == "Second Meta Text"
        assert result[2]["title"] == "Third Meta Text"
        mock_service.list_all_metatexts.assert_called_once_with(unittest.mock.ANY)

    def test_list_metatexts_empty(self, app, client, test_session, override_dependencies):
        """Test metatexts listing when no metatexts exist."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.list_all_metatexts.return_value = []
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_metatext_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 0

    def test_get_metatext_success(self, app, client, test_session, override_dependencies):
        """Test successful metatext retrieval."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_metatext = MetaTextDetail(
            id=1,
            title="Test Meta Text",
            source_document_id=1,
            user_id=1,
            text="Full meta text content",
            chunks=[
                ChunkRead(id=1, text="Chunk 1 text", meta_text_id=1),
                ChunkRead(id=2, text="Chunk 2 text", meta_text_id=1)
            ]
        )
        mock_service.get_metatext_by_id.return_value = mock_metatext
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_metatext_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/1")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["id"] == 1
        assert result["title"] == "Test Meta Text"
        mock_service.get_metatext_by_id.assert_called_once_with(1, unittest.mock.ANY)

    def test_get_metatext_not_found(self, app, client, test_session, override_dependencies):
        """Test metatext retrieval when not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.get_metatext_by_id.side_effect = MetatextNotFoundError(999)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_metatext_service] = lambda: mock_service

        # Execute
        response = client.get("/api/metatext/999")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Meta-text not found."

    def test_delete_metatext_success(self, app, client, test_session, override_dependencies):
        """Test successful metatext deletion."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.delete_metatext.return_value = {"message": "Meta-text deleted successfully"}
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_metatext_service] = lambda: mock_service

        # Execute
        response = client.delete("/api/metatext/1")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert "message" in result
        mock_service.delete_metatext.assert_called_once_with(1, unittest.mock.ANY)

    def test_delete_metatext_not_found(self, app, client, test_session, override_dependencies):
        """Test metatext deletion when not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.delete_metatext.side_effect = MetatextNotFoundError(999)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_metatext_service] = lambda: mock_service

        # Execute
        response = client.delete("/api/metatext/999")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Meta-text not found."

    def test_create_metatext_validation_missing_title(self, client):
        """Test metatext creation with missing title."""
        request_data = {
            "sourceDocId": 1
        }

        # Execute
        response = client.post("/api/metatext", json=request_data)

        # Assert
        assert response.status_code == 422  # Validation error

    def test_create_metatext_validation_missing_source_doc_id(self, client):
        """Test metatext creation with missing source document ID."""
        request_data = {
            "title": "Test Meta Text"
        }

        # Execute
        response = client.post("/api/metatext", json=request_data)

        # Assert
        assert response.status_code == 422  # Validation error

    def test_create_metatext_validation_empty_title(self, app, client, test_session, override_dependencies):
        """Test metatext creation with empty title."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_metatext = MetaTextSummary(
            id=1,
            title="",
            source_document_id=1,
            user_id=1
        )
        mock_service.create_metatext_with_chunks.return_value = mock_metatext
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_metatext_service] = lambda: mock_service

        request_data = {
            "title": "",
            "sourceDocId": 1
        }

        # Execute
        response = client.post("/api/metatext", json=request_data)

        # Assert
        assert response.status_code == 200  # Should be allowed - empty string validation handled by service

    def test_create_metatext_validation_invalid_source_doc_id(self, client):
        """Test metatext creation with invalid source document ID."""
        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": "invalid"
        }

        # Execute
        response = client.post("/api/metatext", json=request_data)

        # Assert
        assert response.status_code == 422  # Validation error

    def test_get_metatext_invalid_id(self, client):
        """Test metatext retrieval with invalid ID."""
        # Execute
        response = client.get("/api/metatext/invalid")

        # Assert
        assert response.status_code == 422  # Validation error

    def test_delete_metatext_invalid_id(self, client):
        """Test metatext deletion with invalid ID."""
        # Execute
        response = client.delete("/api/metatext/invalid")

        # Assert
        assert response.status_code == 422  # Validation error
