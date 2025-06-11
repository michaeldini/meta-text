# Tests for backend/api/chunks.py
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from backend.main import app
from backend.models import Chunk

def create_chunk(session, meta_text_id=1, text="chunk text", position=1.0):
    chunk = Chunk(meta_text_id=meta_text_id, text=text, position=position)
    session.add(chunk)
    session.commit()
    session.refresh(chunk)
    return chunk

def test_get_chunks_api(client: TestClient, session):
    create_chunk(session, meta_text_id=10, text="A", position=1.0)
    create_chunk(session, meta_text_id=10, text="B", position=2.0)
    response = client.get("/api/chunks/all/10")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    # The >= operator between sets checks for a superset relationship
    assert {c["text"] for c in data} >= {"A", "B"}

def test_get_chunk_success(client: TestClient, session):
    chunk = create_chunk(session, meta_text_id=20, text="Hello", position=1.0)
    response = client.get(f"/api/chunk/{chunk.id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == chunk.id
    assert data["text"] == "Hello"

def test_get_chunk_not_found(client: TestClient):
    response = client.get("/api/chunk/9999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Chunk not found"

def test_split_chunk_success(client: TestClient, session):
    chunk = create_chunk(session, text="one two three four", position=1.0)
    response = client.post(f"/api/chunk/{chunk.id}/split?word_index=2")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["text"] == "one two"
    assert data[1]["text"] == "three four"

def test_split_chunk_invalid_index(client: TestClient, session):
    chunk = create_chunk(session, text="one two three", position=1.0)
    # word_index=0 is invalid
    response = client.post(f"/api/chunk/{chunk.id}/split?word_index=0")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    # word_index >= len(words) is invalid
    response = client.post(f"/api/chunk/{chunk.id}/split?word_index=3")
    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_split_chunk_not_found(client: TestClient):
    response = client.post("/api/chunk/9999/split?word_index=1")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Chunk not found"

def test_combine_chunks_success(client: TestClient, session):
    c1 = create_chunk(session, text="first", position=1.0)
    c2 = create_chunk(session, text="second", position=2.0)
    response = client.post(f"/api/chunk/combine?first_chunk_id={c1.id}&second_chunk_id={c2.id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "first second" in data["text"]

def test_combine_chunks_not_found(client: TestClient):
    response = client.post("/api/chunk/combine?first_chunk_id=1&second_chunk_id=9999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Chunk(s) not found"

def test_update_chunk_success(client: TestClient, session):
    chunk = create_chunk(session, text="old text", position=1.0)
    payload = {"text": "new text", "summary": "sum", "notes": "note", "comparison": "comp"}
    response = client.put(f"/api/chunk/{chunk.id}", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["text"] == "new text"
    assert data["summary"] == "sum"
    assert data["notes"] == "note"
    assert data["comparison"] == "comp"

def test_update_chunk_not_found(client: TestClient):
    payload = {"text": "irrelevant"}
    response = client.put("/api/chunk/9999", json=payload)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Chunk not found"
