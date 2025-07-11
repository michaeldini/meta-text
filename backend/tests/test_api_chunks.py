"""Tests for Chunks API endpoints."""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, ANY

from backend.main import app
from backend.services.chunk_service import ChunkService
from backend.models import ChunkRead, AiImageRead
from backend.exceptions.chunk_exceptions import (
    ChunkNotFoundError,
    NoChunksFoundError,
    InvalidSplitIndexError,
    ChunkCombineError,
    ChunkUpdateError
)

client = TestClient(app)

@pytest.fixture
def mock_chunk_service():
    with patch('backend.api.chunks.chunk_service', spec=ChunkService) as mock_service:
        yield mock_service

def test_get_chunks_success(mock_chunk_service):
    # Setup the mock to return a list of ChunkRead objects
    mock_chunk_service.get_all_chunks_for_meta_text.return_value = [
        ChunkRead(
            id=1, text="Chunk 1", meta_text_id=1, position=1.0,
            ai_images=[AiImageRead(id=1, prompt="img1", path="/img1.png", chunk_id=1)],
            notes="", summary="", comparison="", explanation="", compressions=[]
        ),
        ChunkRead(
            id=2, text="Chunk 2", meta_text_id=1, position=2.0,
            ai_images=[],
            notes="", summary="", comparison="", explanation="", compressions=[]
        )
    ]
    
    response = client.get("/chunks/all/1")
    
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 2
    assert response_data[0]['text'] == "Chunk 1"
    assert len(response_data[0]['ai_images']) == 1
    mock_chunk_service.get_all_chunks_for_meta_text.assert_called_once_with(1, ANY)

def test_get_chunks_not_found(mock_chunk_service):
    # Mock the service method to raise NoChunksFoundError
    mock_chunk_service.get_all_chunks_for_meta_text.side_effect = NoChunksFoundError(1)
    response = client.get("/chunks/all/1")
    assert response.status_code == 404
    assert response.json() == {"detail": "No chunks found for meta_text_id: 1"}

def test_get_chunk_success(mock_chunk_service):
    # Mock the service method
    mock_chunk = ChunkRead(
        id=1, text="Test Chunk", meta_text_id=1, position=1.0,
        ai_images=[AiImageRead(id=1, prompt="img1", path="/img1.png", chunk_id=1)],
        notes="", summary="", comparison="", explanation="", compressions=[]
    )
    mock_chunk_service.get_chunk_with_images.return_value = mock_chunk
    
    response = client.get("/chunk/1")
    
    assert response.status_code == 200
    response_data = response.json()
    assert response_data['text'] == "Test Chunk"
    assert len(response_data['ai_images']) == 1
    mock_chunk_service.get_chunk_with_images.assert_called_once_with(1, ANY)

def test_get_chunk_not_found(mock_chunk_service):
    # Mock the service method to raise ChunkNotFoundError
    mock_chunk_service.get_chunk_with_images.side_effect = ChunkNotFoundError(1)
    response = client.get("/chunk/1")
    assert response.status_code == 404
    assert response.json() == {"detail": "Chunk not found"}

def test_split_chunk_success(mock_chunk_service):
    mock_chunk_service.split_chunk.return_value = [
        ChunkRead(id=2, text="Part 1", meta_text_id=1, position=1.0, notes="", summary="", comparison="", explanation="", compressions=[]),
        ChunkRead(id=3, text="Part 2", meta_text_id=1, position=2.0, notes="", summary="", comparison="", explanation="", compressions=[])
    ]
    response = client.post("/chunk/1/split?word_index=5")
    assert response.status_code == 200
    assert len(response.json()) == 2
    mock_chunk_service.split_chunk.assert_called_once_with(1, 5, ANY)

def test_split_chunk_not_found(mock_chunk_service):
    mock_chunk_service.split_chunk.side_effect = ChunkNotFoundError(1)
    response = client.post("/chunk/1/split?word_index=5")
    assert response.status_code == 404
    assert response.json() == {"detail": "Chunk not found"}

def test_split_chunk_invalid_index(mock_chunk_service):
    mock_chunk_service.split_chunk.side_effect = InvalidSplitIndexError(5, 4)
    response = client.post("/chunk/1/split?word_index=5")
    assert response.status_code == 400
    assert "Invalid split index" in response.json()["detail"]

def test_combine_chunks_success(mock_chunk_service):
    mock_chunk_service.combine_chunks.return_value = ChunkRead(
        id=1, text="Combined", meta_text_id=1, position=1.0, notes="", summary="", comparison="", explanation="", compressions=[]
    )
    response = client.post("/chunk/combine?first_chunk_id=1&second_chunk_id=2")
    assert response.status_code == 200
    assert response.json()["text"] == "Combined"
    mock_chunk_service.combine_chunks.assert_called_once_with(1, 2, ANY)

def test_combine_chunks_not_found(mock_chunk_service):
    mock_chunk_service.combine_chunks.side_effect = ChunkNotFoundError(1)
    response = client.post("/chunk/combine?first_chunk_id=1&second_chunk_id=2")
    assert response.status_code == 404
    assert "Chunk not found" in response.json()["detail"]

def test_combine_chunks_error(mock_chunk_service):
    mock_chunk_service.combine_chunks.side_effect = ChunkCombineError("Cannot combine")
    response = client.post("/chunk/combine?first_chunk_id=1&second_chunk_id=2")
    assert response.status_code == 400
    assert "Cannot combine" in response.json()["detail"]

def test_update_chunk_success(mock_chunk_service):
    update_data = {"notes": "new notes"}
    mock_chunk_service.update_chunk.return_value = ChunkRead(
        id=1, text="Text", meta_text_id=1, position=1.0, notes="new notes", summary="", comparison="", explanation="", compressions=[]
    )
    response = client.put("/chunk/1", json=update_data)
    assert response.status_code == 200
    assert response.json()["notes"] == "new notes"
    mock_chunk_service.update_chunk.assert_called_once_with(1, update_data, ANY)

def test_update_chunk_not_found(mock_chunk_service):
    mock_chunk_service.update_chunk.side_effect = ChunkNotFoundError(1)
    response = client.put("/chunk/1", json={"notes": "new notes"})
    assert response.status_code == 404
    assert "Chunk not found" in response.json()["detail"]

def test_update_chunk_error(mock_chunk_service):
    mock_chunk_service.update_chunk.side_effect = ChunkUpdateError("db error")
    response = client.put("/chunk/1", json={"notes": "new notes"})
    assert response.status_code == 500
    assert "Update failed" in response.json()["detail"]
