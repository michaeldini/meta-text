"""Tests for Chunks API endpoints."""
import pytest
import unittest.mock
from unittest.mock import patch
from fastapi.testclient import TestClient
from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine

from backend.api.chunks import router
from backend.models import ChunkRead, ChunkWithImagesRead, AiImageRead
from backend.exceptions.chunk_exceptions import (
    ChunkNotFoundError,
    InvalidSplitIndexError,
    ChunkCombineError,
    ChunkUpdateError,
    NoChunksFoundError
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


class TestChunksEndpoints:
    """Test cases for Chunks API endpoints."""

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_get_chunks_all_success(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test successful retrieval of all chunks for meta-text."""
        # Setup
        mock_get_session.return_value = test_session
        mock_chunks = [
            ChunkWithImagesRead(
                id=1,
                text="First chunk",
                position=1.0,
                notes="Test notes",
                summary="Test summary",
                comparison="",
                meta_text_id=1,
                ai_images=[
                    AiImageRead(id=1, prompt="test prompt", path="/path/to/image.jpg", chunk_id=1)
                ]
            ),
            ChunkWithImagesRead(
                id=2,
                text="Second chunk",
                position=2.0,
                notes="",
                summary="",
                comparison="",
                meta_text_id=1,
                ai_images=[]
            )
        ]
        mock_chunk_service.get_all_chunks_for_meta_text.return_value = mock_chunks

        # Execute
        response = client.get("/api/chunks/all/1")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 2
        assert result[0]["id"] == 1
        assert result[0]["text"] == "First chunk"
        assert len(result[0]["ai_images"]) == 1
        mock_chunk_service.get_all_chunks_for_meta_text.assert_called_once_with(1, unittest.mock.ANY)

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_get_chunks_all_no_chunks_found(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test retrieval when no chunks found."""
        # Setup
        mock_get_session.return_value = test_session
        mock_chunk_service.get_all_chunks_for_meta_text.side_effect = NoChunksFoundError(1)

        # Execute
        response = client.get("/api/chunks/all/1")

        # Assert
        assert response.status_code == 404
        assert "No chunks found for meta_text_id: 1" in response.json()["detail"]

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_get_chunk_success(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test successful retrieval of a specific chunk."""
        # Setup
        mock_get_session.return_value = test_session
        mock_chunk = ChunkWithImagesRead(
            id=1,
            text="Test chunk",
            position=1.0,
            notes="Test notes",
            summary="Test summary",
            comparison="",
            meta_text_id=1,
            ai_images=[]
        )
        mock_chunk_service.get_chunk_with_images.return_value = mock_chunk

        # Execute
        response = client.get("/api/chunk/1")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["id"] == 1
        assert result["text"] == "Test chunk"
        mock_chunk_service.get_chunk_with_images.assert_called_once_with(1, unittest.mock.ANY)

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_get_chunk_not_found(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test retrieval of non-existent chunk."""
        # Setup
        mock_get_session.return_value = test_session
        mock_chunk_service.get_chunk_with_images.side_effect = ChunkNotFoundError(999)

        # Execute
        response = client.get("/api/chunk/999")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Chunk not found"

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_split_chunk_success(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test successful chunk splitting."""
        # Setup
        mock_get_session.return_value = test_session
        mock_chunks = [
            ChunkRead(
                id=1,
                text="First part",
                position=1.0,
                notes="",
                summary="",
                comparison="",
                meta_text_id=1
            ),
            ChunkRead(
                id=2,
                text="Second part",
                position=1.5,
                notes="",
                summary="",
                comparison="",
                meta_text_id=1
            )
        ]
        mock_chunk_service.split_chunk.return_value = mock_chunks

        # Execute
        response = client.post("/api/chunk/1/split?word_index=5")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 2
        assert result[0]["text"] == "First part"
        assert result[1]["text"] == "Second part"
        mock_chunk_service.split_chunk.assert_called_once_with(1, 5, unittest.mock.ANY)

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_split_chunk_not_found(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test splitting non-existent chunk."""
        # Setup
        mock_get_session.return_value = test_session
        mock_chunk_service.split_chunk.side_effect = ChunkNotFoundError(999)

        # Execute
        response = client.post("/api/chunk/999/split?word_index=5")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Chunk not found"

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_split_chunk_invalid_index(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test splitting chunk with invalid word index."""
        # Setup
        mock_get_session.return_value = test_session
        mock_chunk_service.split_chunk.side_effect = InvalidSplitIndexError(1, 100, 50)

        # Execute
        response = client.post("/api/chunk/1/split?word_index=100")

        # Assert
        assert response.status_code == 400
        assert "Invalid split index: 100 (max words: 50)" in response.json()["detail"]

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_combine_chunks_success(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test successful chunk combination."""
        # Setup
        mock_get_session.return_value = test_session
        mock_combined_chunk = ChunkRead(
            id=1,
            text="Combined chunk text",
            position=1.0,
            notes="Combined notes",
            summary="Combined summary",
            comparison="",
            meta_text_id=1
        )
        mock_chunk_service.combine_chunks.return_value = mock_combined_chunk

        # Execute
        response = client.post("/api/chunk/combine?first_chunk_id=1&second_chunk_id=2")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["text"] == "Combined chunk text"
        assert result["notes"] == "Combined notes"
        mock_chunk_service.combine_chunks.assert_called_once_with(1, 2, unittest.mock.ANY)

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_combine_chunks_first_not_found(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test combining chunks when first chunk not found."""
        # Setup
        mock_get_session.return_value = test_session
        mock_chunk_service.combine_chunks.side_effect = ChunkNotFoundError(1)

        # Execute
        response = client.post("/api/chunk/combine?first_chunk_id=1&second_chunk_id=2")

        # Assert
        assert response.status_code == 404
        assert "Chunk not found: 1" in response.json()["detail"]

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_combine_chunks_combine_error(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test combining chunks with combine error."""
        # Setup
        mock_get_session.return_value = test_session
        mock_chunk_service.combine_chunks.side_effect = ChunkCombineError(1, 2, "Cannot combine chunks from different meta-texts")

        # Execute
        response = client.post("/api/chunk/combine?first_chunk_id=1&second_chunk_id=2")

        # Assert
        assert response.status_code == 400
        assert "Cannot combine chunks from different meta-texts" in response.json()["detail"]

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_update_chunk_success(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test successful chunk update."""
        # Setup
        mock_get_session.return_value = test_session
        mock_updated_chunk = ChunkRead(
            id=1,
            text="Updated chunk text",
            position=1.0,
            notes="Updated notes",
            summary="Updated summary",
            comparison="",
            meta_text_id=1
        )
        mock_chunk_service.update_chunk.return_value = mock_updated_chunk

        update_data = {
            "notes": "Updated notes",
            "summary": "Updated summary"
        }

        # Execute
        response = client.put("/api/chunk/1", json=update_data)

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["notes"] == "Updated notes"
        assert result["summary"] == "Updated summary"
        mock_chunk_service.update_chunk.assert_called_once_with(1, update_data, unittest.mock.ANY)

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_update_chunk_not_found(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test updating non-existent chunk."""
        # Setup
        mock_get_session.return_value = test_session
        mock_chunk_service.update_chunk.side_effect = ChunkNotFoundError(999)

        update_data = {
            "notes": "Updated notes"
        }

        # Execute
        response = client.put("/api/chunk/999", json=update_data)

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Chunk not found"

    @patch('backend.api.chunks.get_session')
    @patch('backend.api.chunks.chunk_service')
    def test_update_chunk_update_error(self, mock_chunk_service, mock_get_session, client, test_session):
        """Test chunk update with update error."""
        # Setup
        mock_get_session.return_value = test_session
        mock_chunk_service.update_chunk.side_effect = ChunkUpdateError(1, "Database constraint violation")

        update_data = {
            "notes": "Updated notes"
        }

        # Execute
        response = client.put("/api/chunk/1", json=update_data)

        # Assert
        assert response.status_code == 500
        assert "Update failed: Database constraint violation" in response.json()["detail"]

    def test_split_chunk_missing_word_index(self, client):
        """Test chunk splitting without word index parameter."""
        # Execute
        response = client.post("/api/chunk/1/split")

        # Assert
        assert response.status_code == 422  # Validation error

    def test_combine_chunks_missing_parameters(self, client):
        """Test chunk combination without required parameters."""
        # Execute
        response = client.post("/api/chunk/combine")

        # Assert
        assert response.status_code == 422  # Validation error

    def test_update_chunk_empty_body(self, client):
        """Test chunk update with empty body."""
        # Execute
        response = client.put("/api/chunk/1", json={})

        # Assert
        assert response.status_code == 200  # Should be allowed - empty update
