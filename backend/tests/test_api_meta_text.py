"""
Tests for the MetaText API endpoints.
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


def test_create_metatext_success():
    payload = {
        "title": "Test MetaText",
        "sourceDocId": 1
    }
    response = client.post("/api/metatext", json=payload)
    assert response.status_code in (200, 201)
    data = response.json()
    assert "id" in data
    assert data["title"] == payload["title"]


def test_create_metatext_duplicate_title():
    payload = {
        "title": "Duplicate Title",
        "sourceDocId": 1
    }
    first_response = client.post("/api/metatext", json=payload)
    second_response = client.post("/api/metatext", json=payload)
    assert first_response.status_code in (200, 201)
    assert second_response.status_code in (200, 201)
    first_id = first_response.json()["id"]
    second_id = second_response.json()["id"]
    assert first_id != second_id, "Each MetaText should have a unique id even if title and sourceDocId are the same"


def test_list_metatexts():
    response = client.get("/api/metatext")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_metatext_success():
    payload = {"title": "GetTest", "sourceDocId": 1}
    create_resp = client.post("/api/metatext", json=payload)
    metatext_id = create_resp.json()["id"]
    response = client.get(f"/api/metatext/{metatext_id}")
    assert response.status_code == 200
    assert response.json()["id"] == metatext_id


def test_get_metatext_not_found():
    response = client.get("/api/metatext/999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_delete_metatext_success():
    payload = {"title": "DeleteTest", "sourceDocId": 1}
    create_resp = client.post("/api/metatext", json=payload)
    metatext_id = create_resp.json()["id"]
    response = client.delete(f"/api/metatext/{metatext_id}")
    assert response.status_code == 200
    # Accept either a success message or a result key
    assert "success" in response.text.lower() or response.json().get("result") == "success"


def test_delete_metatext_not_found():
    response = client.delete("/api/metatext/999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_unauthenticated_access():
    # Remove override to simulate unauthenticated
    app.dependency_overrides = {}
    payload = {"title": "NoAuth", "sourceDocId": 1}
    resp_post = client.post("/api/metatext", json=payload)
    resp_get = client.get("/api/metatext")
    assert resp_post.status_code in (401, 403)
    assert resp_get.status_code in (401, 403)
    # Restore override for other tests
    app.dependency_overrides[get_current_user] = override_get_current_user
