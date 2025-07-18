"""
Tests for the Chunk API endpoints.
Utilizes dependency override for authentication to enable isolated testing.
"""
import pytest # noqa: F401
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.auth_dependencies import get_current_user

# Mock user object for dependency override
def override_get_current_user():
    class User:
        id = 1
        username = "testuser"
    return User()

# Apply dependency override for all tests
def setup_module(module):
    app.dependency_overrides[get_current_user] = override_get_current_user

def teardown_module(module):
    app.dependency_overrides = {}

client = TestClient(app)

def create_metatext_and_chunk():
    # Helper to create a MetaText and a Chunk for testing
    metatext_payload = {"title": "ChunkTestMetaText", "sourceDocId": 1}
    metatext_resp = client.post("/api/metatext", json=metatext_payload)
    assert metatext_resp.status_code in (200, 201), f"MetaText creation failed: {metatext_resp.status_code} {metatext_resp.text}"
    metatext_id = metatext_resp.json()["id"]
    chunk_payload = {"text": "one two three four five", "position": 1, "metaTextId": metatext_id}
    chunk_resp = client.post("/api/chunk", json=chunk_payload)
    if chunk_resp.status_code not in (200, 201):
        print(f"Chunk creation failed: {chunk_resp.status_code} {chunk_resp.text}")
    assert chunk_resp.status_code in (200, 201), f"Chunk creation failed: {chunk_resp.status_code} {chunk_resp.text}"
    chunk_json = chunk_resp.json()
    assert "id" in chunk_json, f"Chunk response missing 'id': {chunk_json}"
    chunk_id = chunk_json["id"]
    return metatext_id, chunk_id

def test_create_chunk_success():
    metatext_id, _ = create_metatext_and_chunk()
    payload = {"text": "alpha beta gamma", "position": 2, "metaTextId": metatext_id}
    response = client.post("/api/chunk", json=payload)
    assert response.status_code in (200, 201)
    data = response.json()
    assert "id" in data
    assert data["text"] == payload["text"]

def test_get_chunk_success():
    _, chunk_id = create_metatext_and_chunk()
    response = client.get(f"/api/chunk/{chunk_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == chunk_id
    assert "text" in data

def test_get_chunk_not_found():
    response = client.get("/api/chunk/999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

def test_split_chunk_success():
    _, chunk_id = create_metatext_and_chunk()
    # Split after 2nd word (index 2)
    response = client.post(f"/api/chunk/{chunk_id}/split?word_index=2")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert all("id" in c for c in data)

def test_split_chunk_invalid_index():
    _, chunk_id = create_metatext_and_chunk()
    # Invalid index (0)
    response = client.post(f"/api/chunk/{chunk_id}/split?word_index=0")
    assert response.status_code == 400
    assert "invalid split index" in response.json()["detail"].lower()

def test_combine_chunks_success():
    metatext_id, chunk_id1 = create_metatext_and_chunk()
    # Create a second chunk in the same MetaText
    payload = {"text": "second chunk", "position": 2, "metaTextId": metatext_id}
    resp2 = client.post("/api/chunk", json=payload)
    chunk_id2 = resp2.json()["id"]
    response = client.post(f"/api/chunk/combine?first_chunk_id={chunk_id1}&second_chunk_id={chunk_id2}")
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "text" in data

def test_combine_chunks_not_found():
    response = client.post("/api/chunk/combine?first_chunk_id=999998&second_chunk_id=999999")
    assert response.status_code == 404
    assert "chunk not found" in response.json()["detail"].lower()

def test_update_chunk_success():
    _, chunk_id = create_metatext_and_chunk()
    update_payload = {"text": "updated text"}
    response = client.put(f"/api/chunk/{chunk_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["text"] == update_payload["text"]

def test_update_chunk_not_found():
    update_payload = {"text": "should not work"}
    response = client.put("/api/chunk/999999", json=update_payload)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

def test_unauthenticated_access():
    # Remove override to simulate unauthenticated
    app.dependency_overrides = {}
    response = client.get("/api/chunk/1")
    assert response.status_code in (401, 403)
    # Restore override for other tests
    app.dependency_overrides[get_current_user] = override_get_current_user
