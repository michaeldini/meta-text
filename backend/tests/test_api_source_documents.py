"""Tests for Source Documents API endpoints."""
import pytest
import unittest.mock
from unittest.mock import AsyncMock
from fastapi.testclient import TestClient
from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine
import io

from backend.api.source_documents import router, get_source_document_service
from backend.db import get_session
from backend.models import SourceDocumentSummary, SourceDocumentDetail
from backend.exceptions.source_document_exceptions import (
    SourceDocumentNotFoundError,
    SourceDocumentTitleExistsError,
    SourceDocumentCreationError,
    SourceDocumentHasDependenciesError,
    InvalidFileExtensionError,
    FileSizeExceededError
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


@pytest.fixture
def override_dependencies(app):
    """Override FastAPI dependencies for testing."""
    def cleanup():
        # Clear all dependency overrides after each test
        app.dependency_overrides.clear()
    
    yield cleanup
    cleanup()


class TestSourceDocumentsEndpoints:
    """Test cases for Source Documents API endpoints."""

    def test_create_source_document_success(self, app, client, test_session, sample_file, override_dependencies):
        """Test successful source document creation."""
        # Setup mocks
        mock_service = AsyncMock()
        mock_source_doc = SourceDocumentDetail(
            id=1,
            user_id=1,
            title="Test Document",
            author="Test Author",
            summary="Test Summary",
            characters="Test Characters",
            locations="Test Locations",
            themes="Test Themes",
            symbols="Test Symbols",
            text="This is a sample document content for testing purposes."
        )
        mock_service.create_source_document_from_upload = AsyncMock(return_value=mock_source_doc)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

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

    def test_create_source_document_title_exists(self, app, client, test_session, sample_file, override_dependencies):
        """Test source document creation when title already exists."""
        # Setup mocks
        mock_service = AsyncMock()
        mock_service.create_source_document_from_upload = AsyncMock(
            side_effect=SourceDocumentTitleExistsError("Test Document")
        )
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": "Test Document"},
            files={"file": ("test.txt", sample_file, "text/plain")}
        )

        # Assert
        assert response.status_code == 409
        assert response.json()["detail"] == "Title already exists."

    def test_create_source_document_invalid_file_extension(self, app, client, test_session, sample_file, override_dependencies):
        """Test source document creation with invalid file extension."""
        # Setup mocks
        mock_service = AsyncMock()
        mock_service.create_source_document_from_upload = AsyncMock(
            side_effect=InvalidFileExtensionError("File extension .pdf not allowed. Allowed: .txt")
        )
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": "Test Document"},
            files={"file": ("test.pdf", sample_file, "application/pdf")}
        )

        # Assert
        assert response.status_code == 400
        assert "File extension .pdf not allowed" in response.json()["detail"]

    def test_create_source_document_file_size_exceeded(self, app, client, test_session, override_dependencies):
        """Test source document creation with file size exceeded."""
        # Setup mocks
        mock_service = AsyncMock()
        mock_service.create_source_document_from_upload = AsyncMock(
            side_effect=FileSizeExceededError("File size 15728640 bytes exceeds maximum allowed size of 10485760 bytes")
        )
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Create a large file for testing
        large_content = "A" * (15 * 1024 * 1024)  # 15MB content
        large_file = io.BytesIO(large_content.encode('utf-8'))

        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": "Large Document"},
            files={"file": ("large.txt", large_file, "text/plain")}
        )

        # Assert
        assert response.status_code == 400
        assert "File size" in response.json()["detail"]
        assert "exceeds maximum allowed size" in response.json()["detail"]

    def test_create_source_document_no_filename(self, client, sample_file):
        """Test source document creation with no filename."""
        # Execute - empty filename triggers FastAPI validation
        response = client.post(
            "/api/source-documents",
            data={"title": "Test Document"},
            files={"file": ("", sample_file, "text/plain")}
        )

        # Assert - FastAPI validation catches this before service layer
        assert response.status_code == 422

    def test_create_source_document_creation_error(self, app, client, test_session, sample_file, override_dependencies):
        """Test source document creation with internal error."""
        # Setup mocks
        mock_service = AsyncMock()
        mock_service.create_source_document_from_upload = AsyncMock(
            side_effect=SourceDocumentCreationError("File processing failed")
        )
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": "Test Document"},
            files={"file": ("test.txt", sample_file, "text/plain")}
        )

        # Assert
        assert response.status_code == 500
        assert "File processing failed" in response.json()["detail"]

    def test_list_source_documents_success(self, app, client, test_session, override_dependencies):
        """Test successful source documents listing."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
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
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Execute
        response = client.get("/api/source-documents")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 2
        assert result[0]["title"] == "First Document"
        assert result[1]["title"] == "Second Document"
        mock_service.list_all_source_documents.assert_called_once()

    def test_list_source_documents_empty(self, app, client, test_session, override_dependencies):
        """Test source documents listing when no documents exist."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.list_all_source_documents.return_value = []
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Execute
        response = client.get("/api/source-documents")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 0

    def test_get_source_document_success(self, app, client, test_session, override_dependencies):
        """Test successful source document retrieval."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
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
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Execute
        response = client.get("/api/source-documents/1")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["id"] == 1
        assert result["title"] == "Test Document"
        assert result["text"] == "Full document text content"
        mock_service.get_source_document_by_id.assert_called_once_with(1, unittest.mock.ANY)

    def test_get_source_document_not_found(self, app, client, test_session, override_dependencies):
        """Test source document retrieval when not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.get_source_document_by_id.side_effect = SourceDocumentNotFoundError(999)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Execute
        response = client.get("/api/source-documents/999")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Source document not found."

    def test_delete_source_document_success(self, app, client, test_session, override_dependencies):
        """Test successful source document deletion."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.delete_source_document.return_value = {"message": "Source document deleted successfully", "deleted_id": 1}
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Execute
        response = client.delete("/api/source-documents/1")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["message"] == "Source document deleted successfully"
        assert result["deleted_id"] == 1
        mock_service.delete_source_document.assert_called_once_with(1, unittest.mock.ANY)

    def test_delete_source_document_not_found(self, app, client, test_session, override_dependencies):
        """Test source document deletion when not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.delete_source_document.side_effect = SourceDocumentNotFoundError(999)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Execute
        response = client.delete("/api/source-documents/999")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Source document not found."

    def test_delete_source_document_has_dependencies(self, app, client, test_session, override_dependencies):
        """Test source document deletion when it has dependencies."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.delete_source_document.side_effect = SourceDocumentHasDependenciesError(1, 3)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

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

    def test_create_source_document_empty_title(self, app, client, test_session, sample_file, override_dependencies):
        """Test source document creation with empty title."""
        # Setup mocks
        mock_service = AsyncMock()
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
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service
        
        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": ""},
            files={"file": ("test.txt", sample_file, "text/plain")}
        )

        # Assert - Should be handled by service layer, API accepts empty string
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

    def test_create_source_document_large_file(self, app, client, test_session, override_dependencies):
        """Test source document creation with large file."""
        # Setup mocks
        mock_service = AsyncMock()
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
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service
        
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

    def test_create_source_document_special_characters_title(self, app, client, test_session, sample_file, override_dependencies):
        """Test source document creation with special characters in title."""
        # Setup mocks
        mock_service = AsyncMock()
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

        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

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

    def test_update_source_document_success(self, app, client, test_session, override_dependencies):
        """Test successful source document update."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_updated_doc = SourceDocumentDetail(
            id=1,
            title="Updated Document",
            author="Updated Author",
            summary="Updated Summary",
            characters="Updated Characters",
            locations="Updated Locations",
            themes="Updated Themes",
            symbols="Updated Symbols",
            text="Updated text content"
        )
        mock_service.update_source_document.return_value = mock_updated_doc

        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Execute
        update_data = {
            "title": "Updated Document",
            "author": "Updated Author",
            "summary": "Updated Summary"
        }
        response = client.put("/api/source-documents/1", json=update_data)

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["id"] == 1
        assert result["title"] == "Updated Document"
        assert result["author"] == "Updated Author"
        mock_service.update_source_document.assert_called_once()

    def test_update_source_document_not_found(self, app, client, test_session, override_dependencies):
        """Test source document update when not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.update_source_document.side_effect = SourceDocumentNotFoundError(999)

        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Execute
        update_data = {"title": "Updated Document"}
        response = client.put("/api/source-documents/999", json=update_data)

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Source document not found."

    def test_update_source_document_title_exists(self, app, client, test_session, override_dependencies):
        """Test source document update when title already exists."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.update_source_document.side_effect = SourceDocumentTitleExistsError("Existing Title")

        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Execute
        update_data = {"title": "Existing Title"}
        response = client.put("/api/source-documents/1", json=update_data)

        # Assert
        assert response.status_code == 409
        assert response.json()["detail"] == "Title already exists."

    def test_create_source_document_multiple_validation_errors(self, app, client, test_session, override_dependencies):
        """Test source document creation with multiple validation errors."""
        # Setup mocks
        mock_service = AsyncMock()
        mock_service.create_source_document_from_upload = AsyncMock(
            side_effect=InvalidFileExtensionError("File extension .exe not allowed. Allowed: .txt")
        )

        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Create a file with disallowed extension
        content = "This should not be allowed"
        file_content = io.BytesIO(content.encode('utf-8'))

        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": "Malicious Document"},
            files={"file": ("malware.exe", file_content, "application/octet-stream")}
        )

        # Assert
        assert response.status_code == 400
        assert "File extension .exe not allowed" in response.json()["detail"]

    def test_create_source_document_edge_case_filename(self, app, client, test_session, override_dependencies):
        """Test source document creation with edge case filename."""
        # Setup mocks
        mock_service = AsyncMock()
        mock_service.create_source_document_from_upload = AsyncMock(
            side_effect=InvalidFileExtensionError("File extension .TXT not allowed. Allowed: .txt")
        )

        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        content = "Test content"
        file_content = io.BytesIO(content.encode('utf-8'))

        # Execute - test case sensitivity
        response = client.post(
            "/api/source-documents",
            data={"title": "Case Test"},
            files={"file": ("test.TXT", file_content, "text/plain")}
        )

        # Assert - service should handle case normalization
        assert response.status_code == 400

    def test_create_source_document_boundary_file_size(self, app, client, test_session, override_dependencies):
        """Test source document creation with boundary file size."""
        # Setup mocks
        mock_service = AsyncMock()
        mock_document = SourceDocumentDetail(
            id=1,
            title="Boundary Test",
            author=None,
            summary=None,
            characters=None,
            locations=None,
            themes=None,
            symbols=None,
            text="Content at boundary"
        )
        mock_service.create_source_document_from_upload = AsyncMock(return_value=mock_document)

        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_source_document_service] = lambda: mock_service

        # Create file at boundary (mock as if validation passed)
        content = "A" * (10 * 1024 * 1024)  # Exactly 10MB
        file_content = io.BytesIO(content.encode('utf-8'))

        # Execute
        response = client.post(
            "/api/source-documents",
            data={"title": "Boundary Test"},
            files={"file": ("boundary.txt", file_content, "text/plain")}
        )

        # Assert
        assert response.status_code == 200
