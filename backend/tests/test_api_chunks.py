"""Tests for Chunks API endpoints."""
import pytest
import unittest.mock
from fastapi.testclient import TestClient
from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine

from backend.api.chunks import router, get_chunk_service
from backend.db import get_session
from backend.models import ChunkRead, AiImageRead
from backend.exceptions.chunk_exceptions import (
    ChunkNotFoundError,
    InvalidSplitIndexError,
    ChunkCombineError,
    ChunkUpdateError
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
        app.dependency_overrides.clear()
    
    yield cleanup
    cleanup()


class TestChunksEndpoints:
    """Test cases for Chunks API endpoints."""

    def test_get_chunk_success(self, app, client, test_session, override_dependencies):
        """Test successful chunk retrieval."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_chunk = ChunkRead(
            id=1, 
            text="Test Chunk", 
            meta_text_id=1, 
            position=1.0,
            ai_images=[AiImageRead(id=1, prompt="img1", path="/img1.png", chunk_id=1)],
            notes="Test notes", 
            summary="Test summary", 
            comparison="Test comparison", 
            explanation="Test explanation", 
            compressions=[]
        )
        mock_service.get_chunk_with_images.return_value = mock_chunk
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

        # Execute
        response = client.get("/api/chunk/1")

        # Assert
        assert response.status_code == 200
        response_data = response.json()
        assert response_data['text'] == "Test Chunk"
        assert response_data['id'] == 1
        assert len(response_data['ai_images']) == 1
        mock_service.get_chunk_with_images.assert_called_once_with(1, unittest.mock.ANY)

    def test_get_chunk_not_found(self, app, client, test_session, override_dependencies):
        """Test chunk retrieval when chunk not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.get_chunk_with_images.side_effect = ChunkNotFoundError(999)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

        # Execute
        response = client.get("/api/chunk/999")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Chunk not found"

    def test_split_chunk_success(self, app, client, test_session, override_dependencies):
        """Test successful chunk splitting."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_chunks = [
            ChunkRead(
                id=2, text="Part 1", meta_text_id=1, position=1.0, 
                notes="", summary="", comparison="", explanation="", 
                ai_images=[], compressions=[]
            ),
            ChunkRead(
                id=3, text="Part 2", meta_text_id=1, position=2.0, 
                notes="", summary="", comparison="", explanation="", 
                ai_images=[], compressions=[]
            )
        ]
        mock_service.split_chunk.return_value = mock_chunks
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

        # Execute
        response = client.post("/api/chunk/1/split?word_index=5")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert len(result) == 2
        assert result[0]['text'] == "Part 1"
        assert result[1]['text'] == "Part 2"
        mock_service.split_chunk.assert_called_once_with(1, 5, unittest.mock.ANY)

    def test_split_chunk_not_found(self, app, client, test_session, override_dependencies):
        """Test chunk splitting when chunk not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.split_chunk.side_effect = ChunkNotFoundError(999)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

        # Execute
        response = client.post("/api/chunk/999/split?word_index=5")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Chunk not found"

    def test_split_chunk_invalid_index(self, app, client, test_session, override_dependencies):
        """Test chunk splitting with invalid word index."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.split_chunk.side_effect = InvalidSplitIndexError(1, 5, 4)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

        # Execute
        response = client.post("/api/chunk/1/split?word_index=5")

        # Assert
        assert response.status_code == 400
        assert "Invalid split index" in response.json()["detail"]
        assert "5" in response.json()["detail"]
        assert "4" in response.json()["detail"]

    def test_combine_chunks_success(self, app, client, test_session, override_dependencies):
        """Test successful chunk combination."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_combined_chunk = ChunkRead(
            id=1, text="Combined chunk text", meta_text_id=1, position=1.0, 
            notes="", summary="", comparison="", explanation="", 
            ai_images=[], compressions=[]
        )
        mock_service.combine_chunks.return_value = mock_combined_chunk
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

        # Execute
        response = client.post("/api/chunk/combine?first_chunk_id=1&second_chunk_id=2")

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["text"] == "Combined chunk text"
        assert result["id"] == 1
        mock_service.combine_chunks.assert_called_once_with(1, 2, unittest.mock.ANY)

    def test_combine_chunks_not_found(self, app, client, test_session, override_dependencies):
        """Test chunk combination when chunk not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.combine_chunks.side_effect = ChunkNotFoundError(999)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

        # Execute
        response = client.post("/api/chunk/combine?first_chunk_id=999&second_chunk_id=2")

        # Assert
        assert response.status_code == 404
        assert "Chunk not found" in response.json()["detail"]

    def test_combine_chunks_error(self, app, client, test_session, override_dependencies):
        """Test chunk combination with business logic error."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.combine_chunks.side_effect = ChunkCombineError(1, 2, "Cannot combine non-adjacent chunks")
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

        # Execute
        response = client.post("/api/chunk/combine?first_chunk_id=1&second_chunk_id=2")

        # Assert
        assert response.status_code == 400
        assert "Cannot combine non-adjacent chunks" in response.json()["detail"]

    def test_update_chunk_success(self, app, client, test_session, override_dependencies):
        """Test successful chunk update."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_updated_chunk = ChunkRead(
            id=1, text="Original text", meta_text_id=1, position=1.0, 
            notes="Updated notes", summary="Updated summary", 
            comparison="", explanation="", ai_images=[], compressions=[]
        )
        mock_service.update_chunk.return_value = mock_updated_chunk
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

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
        mock_service.update_chunk.assert_called_once_with(1, update_data, unittest.mock.ANY)

    def test_update_chunk_not_found(self, app, client, test_session, override_dependencies):
        """Test chunk update when chunk not found."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.update_chunk.side_effect = ChunkNotFoundError(999)
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

        # Execute
        response = client.put("/api/chunk/999", json={"notes": "new notes"})

        # Assert
        assert response.status_code == 404
        assert "Chunk not found" in response.json()["detail"]

    def test_update_chunk_error(self, app, client, test_session, override_dependencies):
        """Test chunk update with internal error."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_service.update_chunk.side_effect = ChunkUpdateError(1, "Database connection failed")
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

        # Execute
        response = client.put("/api/chunk/1", json={"notes": "new notes"})

        # Assert
        assert response.status_code == 500
        assert "Update failed" in response.json()["detail"]
        assert "Database connection failed" in response.json()["detail"]

    def test_update_chunk_partial_update(self, app, client, test_session, override_dependencies):
        """Test chunk update with partial data (only some fields)."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_updated_chunk = ChunkRead(
            id=1, text="Original text", meta_text_id=1, position=1.0, 
            notes="Only notes updated", summary="Original summary", 
            comparison="", explanation="", ai_images=[], compressions=[]
        )
        mock_service.update_chunk.return_value = mock_updated_chunk
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

        # Execute - only update notes
        response = client.put("/api/chunk/1", json={"notes": "Only notes updated"})

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["notes"] == "Only notes updated"
        # Verify that only the notes field was passed to the service
        mock_service.update_chunk.assert_called_once_with(1, {"notes": "Only notes updated"}, unittest.mock.ANY)

    def test_get_chunk_invalid_id(self, client):
        """Test chunk retrieval with invalid chunk ID."""
        # Execute
        response = client.get("/api/chunk/invalid")

        # Assert
        assert response.status_code == 422  # Validation error

    def test_split_chunk_missing_word_index(self, client):
        """Test chunk splitting without word_index parameter."""
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

    def test_update_chunk_empty_body(self, app, client, test_session, override_dependencies):
        """Test chunk update with empty request body."""
        # Setup mocks
        mock_service = unittest.mock.Mock()
        mock_chunk = ChunkRead(
            id=1, text="Original text", meta_text_id=1, position=1.0, 
            notes="", summary="", comparison="", explanation="", 
            ai_images=[], compressions=[]
        )
        mock_service.update_chunk.return_value = mock_chunk
        
        # Override dependencies
        app.dependency_overrides[get_session] = lambda: test_session
        app.dependency_overrides[get_chunk_service] = lambda: mock_service

        # Execute
        response = client.put("/api/chunk/1", json={})

        # Assert
        assert response.status_code == 200
        # Verify that an empty dict was passed to the service (partial update with no changes)
        mock_service.update_chunk.assert_called_once_with(1, {}, unittest.mock.ANY)
