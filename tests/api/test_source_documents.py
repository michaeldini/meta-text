# Tests for backend/api/source_documents.py
import io
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from backend.main import app
from backend.models import SourceDocument

def test_create_source_document_success(client: TestClient):
    file_content = b"This is a test document."
    response = client.post(
        "/api/source-documents",
        data={"title": "Doc1"},
        files={"file": ("doc.txt", io.BytesIO(file_content), "text/plain")},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "Doc1"
    assert data["text"] == "This is a test document."
    assert "id" in data

def test_create_source_document_duplicate_title(client: TestClient):
    file_content = b"Doc text."
    client.post(
        "/api/source-documents",
        data={"title": "Doc2"},
        files={"file": ("doc.txt", io.BytesIO(file_content), "text/plain")},
    )
    response = client.post(
        "/api/source-documents",
        data={"title": "Doc2"},
        files={"file": ("doc2.txt", io.BytesIO(file_content), "text/plain")},
    )
    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json()["detail"] == "Title already exists."

def test_list_source_documents(client: TestClient, session):
    session.add(SourceDocument(title="Doc3", text="A"))
    session.add(SourceDocument(title="Doc4", text="B"))
    session.commit()
    response = client.get("/api/source-documents")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    titles = [d["title"] for d in data]
    assert set(titles) >= {"Doc3", "Doc4"}

def test_get_source_document_success(client: TestClient, session):
    doc = SourceDocument(title="Doc5", text="Hello")
    session.add(doc)
    session.commit()
    session.refresh(doc)
    response = client.get(f"/api/source-documents/{doc.id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == doc.id
    assert data["title"] == "Doc5"
    assert data["text"] == "Hello"

def test_get_source_document_not_found(client: TestClient):
    response = client.get("/api/source-documents/9999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Source document not found."

def test_delete_source_document_success(client: TestClient, session):
    doc = SourceDocument(title="Doc6", text="Bye")
    session.add(doc)
    session.commit()
    session.refresh(doc)
    response = client.delete(f"/api/source-documents/{doc.id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["success"] is True
    # Confirm deletion
    get_resp = client.get(f"/api/source-documents/{doc.id}")
    assert get_resp.status_code == status.HTTP_404_NOT_FOUND

def test_delete_source_document_not_found(client: TestClient):
    response = client.delete("/api/source-documents/9999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Source document not found."
