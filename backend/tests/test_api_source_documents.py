"""Tests for Source Documents API endpoints."""
import pytest
import unittest.mock
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine
import io

from backend.api.source_documents import router
from backend.models import SourceDocumentSummary, SourceDocumentDetail
from backend.exceptions.source_document_exceptions import (
    SourceDocumentNotFoundError,
    SourceDocumentTitleExistsError,
    SourceDocumentCreationError,
    SourceDocumentHasDependenciesError
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
def sample_file():
    """Create a sample file for testing."""
    content = "This is a sample document content for testing purposes."
    return io.BytesIO(content.encode('utf-8'))


class TestSourceDocumentsEndpoints:
    """Test cases for Source Documents API endpoints."""

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_create_source_document_success(self, mock_service, mock_get_session, client, test_session, sample_file):
        """Test successful source document creation."""
        # Setup
        mock_get_session.return_value = test_session
        mock_source_doc = SourceDocumentDetail(
            id=1,
            title="Test Document",
            author="Test Author",
            summary="Test Summary",
            characters="Test Characters",
            locations="Test Locations",
            themes="Test Themes",
            symbols="Test Symbols",
            text="This is a sample document content for testing purposes."
        )
        # Mock the async method properly
        mock_service.create_source_document_from_upload = AsyncMock(return_value=mock_source_doc)

        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": "Test Document"},
            files={"file": ("test.txt", sample_file, "text/plain")}
        )

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["id"] == 1
        assert result["title"] == "Test Document"
        assert result["text"] == "This is a sample document content for testing purposes."
        mock_service.create_source_document_from_upload.assert_called_once()

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_create_source_document_title_exists(self, mock_service, mock_get_session, client, test_session, sample_file):
        """Test source document creation when title already exists."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.create_source_document_from_upload = AsyncMock(
            side_effect=SourceDocumentTitleExistsError("Test Document")
        )

        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": "Test Document"},
            files={"file": ("test.txt", sample_file, "text/plain")}
        )

        # Assert
        assert response.status_code == 409
        assert response.json()["detail"] == "Title already exists."

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_create_source_document_creation_error(self, mock_service, mock_get_session, client, test_session, sample_file):
        """Test source document creation with internal error."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.create_source_document_from_upload = AsyncMock(
            side_effect=SourceDocumentCreationError("File processing failed")
        )

        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": "Test Document"},
            files={"file": ("test.txt", sample_file, "text/plain")}
        )

        # Assert
        assert response.status_code == 500
        assert "File processing failed" in response.json()["detail"]

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_list_source_documents_success(self, mock_service, mock_get_session, client, test_session):
        """Test successful source documents listing."""
        # Setup
        mock_get_session.return_value = test_session
        mock_documents = [
            SourceDocumentSummary(
                id=1,
                title="First Document",
                author="Author 1",
                summary="Summary 1",
                characters="Characters 1",
                locations="Locations 1",
                themes="Themes 1",
                symbols="Symbols 1"
            ),
            SourceDocumentSummary(
                id=2,
                title="Second Document",
                author="Author 2",
                summary="Summary 2",
                characters="Characters 2",
                locations="Locations 2",
                themes="Themes 2",
                symbols="Symbols 2"
            )
        ]
        mock_service.list_all_source_documents.return_value = mock_documents

        # Execute
        response = client.get("/api/source-documents")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 2
        assert result[0]["title"] == "First Document"
        assert result[1]["title"] == "Second Document"
        mock_service.list_all_source_documents.assert_called_once()

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_list_source_documents_empty(self, mock_service, mock_get_session, client, test_session):
        """Test source documents listing when no documents exist."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.list_all_source_documents.return_value = []

        # Execute
        response = client.get("/api/source-documents")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 0

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_get_source_document_success(self, mock_service, mock_get_session, client, test_session):
        """Test successful source document retrieval."""
        # Setup
        mock_get_session.return_value = test_session
        mock_document = SourceDocumentDetail(
            id=1,
            title="Test Document",
            author="Test Author",
            summary="Test Summary",
            characters="Test Characters",
            locations="Test Locations",
            themes="Test Themes",
            symbols="Test Symbols",
            text="Full document text content"
        )
        mock_service.get_source_document_by_id.return_value = mock_document

        # Execute
        response = client.get("/api/source-documents/1")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["id"] == 1
        assert result["title"] == "Test Document"
        assert result["text"] == "Full document text content"
        mock_service.get_source_document_by_id.assert_called_once_with(1, unittest.mock.ANY)

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_get_source_document_not_found(self, mock_service, mock_get_session, client, test_session):
        """Test source document retrieval when not found."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.get_source_document_by_id.side_effect = SourceDocumentNotFoundError(999)

        # Execute
        response = client.get("/api/source-documents/999")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Source document not found."

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_delete_source_document_success(self, mock_service, mock_get_session, client, test_session):
        """Test successful source document deletion."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.delete_source_document.return_value = {"message": "Source document deleted successfully"}

        # Execute
        response = client.delete("/api/source-documents/1")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert "message" in result
        mock_service.delete_source_document.assert_called_once_with(1, unittest.mock.ANY)

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_delete_source_document_not_found(self, mock_service, mock_get_session, client, test_session):
        """Test source document deletion when not found."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.delete_source_document.side_effect = SourceDocumentNotFoundError(999)

        # Execute
        response = client.delete("/api/source-documents/999")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Source document not found."

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_delete_source_document_has_dependencies(self, mock_service, mock_get_session, client, test_session):
        """Test source document deletion when it has dependencies."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.delete_source_document.side_effect = SourceDocumentHasDependenciesError(1, 3)

        # Execute
        response = client.delete("/api/source-documents/1")

        # Assert
        assert response.status_code == 400
        assert "Cannot delete: 3 MetaText records exist" in response.json()["detail"]

    def test_create_source_document_missing_title(self, client, sample_file):
        """Test source document creation with missing title."""
        # Execute
        response = client.post(
            "/api/source-documents",
            files={"file": ("test.txt", sample_file, "text/plain")}
        )

        # Assert
        assert response.status_code == 422  # Validation error

    def test_create_source_document_missing_file(self, client):
        """Test source document creation with missing file."""
        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": "Test Document"}
        )

        # Assert
        assert response.status_code == 422  # Validation error

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_create_source_document_empty_title(self, mock_service, mock_get_session, client, test_session, sample_file):
        """Test source document creation with empty title."""
        # Setup
        mock_get_session.return_value = test_session
        # Mock successful creation since API layer doesn't validate title
        mock_document = SourceDocumentDetail(
            id=1,
            title="",
            author=None,
            summary=None,
            characters=None,
            locations=None,
            themes=None,
            symbols=None,
            text="Sample test content"
        )
        mock_service.create_source_document_from_upload = AsyncMock(return_value=mock_document)
        
        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": ""},
            files={"file": ("test.txt", sample_file, "text/plain")}
        )

        # Assert
        # Should be handled by service layer, API accepts empty string
        assert response.status_code == 200

    def test_get_source_document_invalid_id(self, client):
        """Test source document retrieval with invalid ID."""
        # Execute
        response = client.get("/api/source-documents/invalid")

        # Assert
        assert response.status_code == 422  # Validation error

    def test_delete_source_document_invalid_id(self, client):
        """Test source document deletion with invalid ID."""
        # Execute
        response = client.delete("/api/source-documents/invalid")

        # Assert
        assert response.status_code == 422  # Validation error

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_create_source_document_large_file(self, mock_service, mock_get_session, client, test_session):
        """Test source document creation with large file."""
        # Setup
        mock_get_session.return_value = test_session
        mock_document = SourceDocumentDetail(
            id=1,
            title="Large Document",
            author=None,
            summary=None,
            characters=None,
            locations=None,
            themes=None,
            symbols=None,
            text="A" * 10000  # Large content
        )
        mock_service.create_source_document_from_upload = AsyncMock(return_value=mock_document)
        
        # Create a large file content
        large_content = "A" * 10000  # 10KB file
        large_file = io.BytesIO(large_content.encode('utf-8'))

        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": "Large Document"},
            files={"file": ("large.txt", large_file, "text/plain")}
        )

        # Should be handled properly regardless of size (within reasonable limits)
        assert response.status_code == 200

    @patch('backend.api.source_documents.get_session')
    @patch('backend.api.source_documents.source_document_service')
    def test_create_source_document_special_characters_title(self, mock_service, mock_get_session, client, test_session, sample_file):
        """Test source document creation with special characters in title."""
        # Setup
        mock_get_session.return_value = test_session
        mock_source_doc = SourceDocumentDetail(
            id=1,
            title="Test Document with Special Characters: @#$%",
            author=None,
            summary=None,
            characters=None,
            locations=None,
            themes=None,
            symbols=None,
            text="Sample content"
        )
        mock_service.create_source_document_from_upload = AsyncMock(return_value=mock_source_doc)

        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": "Test Document with Special Characters: @#$%"},
            files={"file": ("test.txt", sample_file, "text/plain")}
        )

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["title"] == "Test Document with Special Characters: @#$%"
