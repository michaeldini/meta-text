"""Tests for MetaText API endpoints."""
import pytest
import unittest.mock
from unittest.mock import patch
from fastapi.testclient import TestClient
from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine

from backend.api.meta_text import router
from backend.models import MetaTextRead
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


class TestMetaTextEndpoints:
    """Test cases for MetaText API endpoints."""

    @patch('backend.api.meta_text.get_session')
    @patch('backend.api.meta_text.meta_text_service')
    def test_create_meta_text_success(self, mock_service, mock_get_session, client, test_session):
        """Test successful meta-text creation."""
        # Setup
        mock_get_session.return_value = test_session
        mock_meta_text = MetaTextRead(
            id=1,
            title="Test Meta Text",
            source_document_id=1
        )
        mock_service.create_meta_text_with_chunks.return_value = mock_meta_text

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

    @patch('backend.api.meta_text.get_session')
    @patch('backend.api.meta_text.meta_text_service')
    def test_create_meta_text_source_doc_not_found(self, mock_service, mock_get_session, client, test_session):
        """Test meta-text creation when source document not found."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.create_meta_text_with_chunks.side_effect = SourceDocumentNotFoundError(999)

        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": 999
        }

        # Execute
        response = client.post("/api/meta-text", json=request_data)

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Source document not found."

    @patch('backend.api.meta_text.get_session')
    @patch('backend.api.meta_text.meta_text_service')
    def test_create_meta_text_title_exists(self, mock_service, mock_get_session, client, test_session):
        """Test meta-text creation when title already exists."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.create_meta_text_with_chunks.side_effect = MetaTextTitleExistsError("Test Meta Text")

        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": 1
        }

        # Execute
        response = client.post("/api/meta-text", json=request_data)

        # Assert
        assert response.status_code == 409
        assert response.json()["detail"] == "Meta-text title already exists."

    @patch('backend.api.meta_text.get_session')
    @patch('backend.api.meta_text.meta_text_service')
    def test_create_meta_text_creation_error(self, mock_service, mock_get_session, client, test_session):
        """Test meta-text creation with internal error."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.create_meta_text_with_chunks.side_effect = MetaTextCreationError("Database error")

        request_data = {
            "title": "Test Meta Text",
            "sourceDocId": 1
        }

        # Execute
        response = client.post("/api/meta-text", json=request_data)

        # Assert
        assert response.status_code == 500
        assert "Database error" in response.json()["detail"]

    @patch('backend.api.meta_text.get_session')
    @patch('backend.api.meta_text.meta_text_service')
    def test_list_meta_texts_success(self, mock_service, mock_get_session, client, test_session):
        """Test successful meta-texts listing."""
        # Setup
        mock_get_session.return_value = test_session
        mock_meta_texts = [
            MetaTextRead(id=1, title="First Meta Text", source_document_id=1),
            MetaTextRead(id=2, title="Second Meta Text", source_document_id=1),
            MetaTextRead(id=3, title="Third Meta Text", source_document_id=2)
        ]
        mock_service.list_all_meta_texts.return_value = mock_meta_texts

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

    @patch('backend.api.meta_text.get_session')
    @patch('backend.api.meta_text.meta_text_service')
    def test_list_meta_texts_empty(self, mock_service, mock_get_session, client, test_session):
        """Test meta-texts listing when no meta-texts exist."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.list_all_meta_texts.return_value = []

        # Execute
        response = client.get("/api/meta-text")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 0

    @patch('backend.api.meta_text.get_session')
    @patch('backend.api.meta_text.meta_text_service')
    def test_get_meta_text_success(self, mock_service, mock_get_session, client, test_session):
        """Test successful meta-text retrieval."""
        # Setup
        mock_get_session.return_value = test_session
        mock_meta_text = MetaTextRead(
            id=1,
            title="Test Meta Text",
            source_document_id=1
        )
        mock_service.get_meta_text_by_id.return_value = mock_meta_text

        # Execute
        response = client.get("/api/meta-text/1")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["id"] == 1
        assert result["title"] == "Test Meta Text"
        mock_service.get_meta_text_by_id.assert_called_once_with(1, unittest.mock.ANY)

    @patch('backend.api.meta_text.get_session')
    @patch('backend.api.meta_text.meta_text_service')
    def test_get_meta_text_not_found(self, mock_service, mock_get_session, client, test_session):
        """Test meta-text retrieval when not found."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.get_meta_text_by_id.side_effect = MetaTextNotFoundError(999)

        # Execute
        response = client.get("/api/meta-text/999")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Meta-text not found."

    @patch('backend.api.meta_text.get_session')
    @patch('backend.api.meta_text.meta_text_service')
    def test_delete_meta_text_success(self, mock_service, mock_get_session, client, test_session):
        """Test successful meta-text deletion."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.delete_meta_text.return_value = {"message": "Meta-text deleted successfully"}

        # Execute
        response = client.delete("/api/meta-text/1")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert "message" in result
        mock_service.delete_meta_text.assert_called_once_with(1, unittest.mock.ANY)

    @patch('backend.api.meta_text.get_session')
    @patch('backend.api.meta_text.meta_text_service')
    def test_delete_meta_text_not_found(self, mock_service, mock_get_session, client, test_session):
        """Test meta-text deletion when not found."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service.delete_meta_text.side_effect = MetaTextNotFoundError(999)

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

    def test_create_meta_text_validation_empty_title(self, client):
        """Test meta-text creation with empty title."""
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
