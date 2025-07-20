"""
Tests for the source document API endpoints.
Covers create, list, get, update, and delete operations.
"""

import io
import pytest # noqa: F401
from fastapi.testclient import TestClient
from backend.main import app
from backend.dependencies import get_current_user

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


def test_list_source_documents():
    resp = client.get("api/source-documents")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert any(doc["title"] == "Test Document" for doc in data)


def test_get_source_document():
    resp = client.get("api/source-documents/1")
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Test Document"


def test_create_source_document():
    file_content = b"This is a new test document."
    files = {"file": ("test.txt", io.BytesIO(file_content), "text/plain")}
    data = {"title": "Unique Title"}
    resp = client.post("api/source-documents", data=data, files=files)
    assert resp.status_code == 200
    result = resp.json()
    assert result["title"] == "Unique Title"


def test_create_source_document_duplicate_title():
    file_content = b"Duplicate title test."
    files = {"file": ("test.txt", io.BytesIO(file_content), "text/plain")}
    data = {"title": "Test Document"}  # Already exists from fixture
    resp = client.post("api/source-documents", data=data, files=files)
    assert resp.status_code == 409
    assert resp.json()["detail"] == "Title already exists."


def test_update_source_document():
    update = {"title": "Updated Title"}
    resp = client.put("api/source-documents/1", json=update)
    assert resp.status_code == 200
    assert resp.json()["title"] == "Updated Title"


def test_update_source_document_not_found():
    update = {"title": "Doesn't Matter"}
    resp = client.put("api/source-documents/999", json=update)
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Source document not found."


def test_delete_source_document():
    # First, create a new doc to delete
    file_content = b"Delete me."
    files = {"file": ("delete.txt", io.BytesIO(file_content), "text/plain")}
    data = {"title": "Delete Me"}
    create_resp = client.post("api/source-documents", data=data, files=files)
    doc_id = create_resp.json()["id"]
    del_resp = client.delete(f"api/source-documents/{doc_id}")
    assert del_resp.status_code == 200
    assert del_resp.json()["message"] == 'Source document deleted successfully.'


def test_delete_source_document_not_found():
    resp = client.delete("api/source-documents/9999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Source document not found."
