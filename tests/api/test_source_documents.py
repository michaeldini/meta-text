# Tests for backend/api/source_documents.py
import io
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel, create_engine, Session
from backend.main import app
from backend.db import get_session
from backend.models import SourceDocument

# Use an in-memory SQLite database for testing with StaticPool to persist tables across connections
TEST_DB_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

@pytest.fixture(name="session")
def session_fixture():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session):
    def override_get_session():
        with Session(engine) as s:
            yield s
    app.dependency_overrides[get_session] = override_get_session
    return TestClient(app)

def test_create_source_document_success(client):
    file_content = b"This is a test document."
    response = client.post(
        "/api/source-documents",
        data={"title": "Doc1"},
        files={"file": ("doc.txt", io.BytesIO(file_content), "text/plain")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Doc1"
    assert data["text"] == "This is a test document."
    assert "id" in data

def test_create_source_document_duplicate_title(client):
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
    assert response.status_code == 409
    assert response.json()["detail"] == "Title already exists."

def test_list_source_documents(client, session):
    session.add(SourceDocument(title="Doc3", text="A"))
    session.add(SourceDocument(title="Doc4", text="B"))
    session.commit()
    response = client.get("/api/source-documents")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    titles = [d["title"] for d in data]
    assert set(titles) >= {"Doc3", "Doc4"}

def test_get_source_document_success(client, session):
    doc = SourceDocument(title="Doc5", text="Hello")
    session.add(doc)
    session.commit()
    session.refresh(doc)
    response = client.get(f"/api/source-documents/{doc.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == doc.id
    assert data["title"] == "Doc5"
    assert data["text"] == "Hello"

def test_get_source_document_not_found(client):
    response = client.get("/api/source-documents/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Source document not found."

def test_delete_source_document_success(client, session):
    doc = SourceDocument(title="Doc6", text="Bye")
    session.add(doc)
    session.commit()
    session.refresh(doc)
    response = client.delete(f"/api/source-documents/{doc.id}")
    assert response.status_code == 200
    assert response.json()["success"] is True
    # Confirm deletion
    get_resp = client.get(f"/api/source-documents/{doc.id}")
    assert get_resp.status_code == 404

def test_delete_source_document_not_found(client):
    response = client.delete("/api/source-documents/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Source document not found."

def test_update_source_document_success(client, session):
    doc = SourceDocument(title="Doc7", text="Old text")
    session.add(doc)
    session.commit()
    session.refresh(doc)
    response = client.patch(
        f"/api/source-documents/{doc.id}",
        data={
            "title": "Doc7-updated",
            "text": "New text",
            "summary": "",
            "characters": "",
            "locations": "",
            "themes": "",
            "symbols": "",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == doc.id
    assert data["title"] == "Doc7-updated"
    assert data["text"] == "New text"

def test_update_source_document_not_found(client):
    response = client.patch(
        "/api/source-documents/9999",
        data={"title": "DoesNotExist"},
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Source document not found."

def test_update_source_document_duplicate_title(client, session):
    doc1 = SourceDocument(title="Doc8", text="A")
    doc2 = SourceDocument(title="Doc9", text="B")
    session.add(doc1)
    session.add(doc2)
    session.commit()
    session.refresh(doc2)
    response = client.patch(
        f"/api/source-documents/{doc2.id}",
        data={"title": "Doc8"},
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "Title already exists."
