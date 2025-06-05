# Tests for backend/api/meta_text.py
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import StaticPool
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

# Dependency override for test DB
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

def create_source_document(session, title="Test Doc", text="Hello world."):
    doc = SourceDocument(title=title, text=text)
    session.add(doc)
    session.commit()
    session.refresh(doc)
    return doc

def test_create_meta_text_success(client: TestClient, session):
    doc = create_source_document(session)
    payload = {"sourceDocId": doc.id, "title": "Meta 1"}
    response = client.post("/api/meta-text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["title"] == "Meta 1"
    assert "id" in data

def test_create_meta_text_source_not_found(client: TestClient, session: Session):
    # Attempt to create a meta-text with a non-existent source document
    payload = {"sourceDocId": 9999, "title": "Meta 2"}
    response = client.post("/api/meta-text", json=payload)
    assert response.status_code == 404
    assert response.json()["detail"] == "Source document not found."

def test_list_meta_texts(client: TestClient, session: Session):
    doc = create_source_document(session)
    resp1 = client.post("/api/meta-text", json={"sourceDocId": doc.id, "title": "Meta 4"})
    resp2 = client.post("/api/meta-text", json={"sourceDocId": doc.id, "title": "Meta 5"})
    assert resp1.status_code == 200
    assert resp2.status_code == 200
    response = client.get("/api/meta-text")
    assert response.status_code == 200
    data = response.json()
    # Should return a list of meta-texts
    assert isinstance(data, list)
    titles = [item["title"] for item in data]
    assert "Meta 4" in titles
    assert "Meta 5" in titles
    # Check required fields for MetaTextRead
    for item in data:
        assert "id" in item
        assert "title" in item
        assert "source_document_id" in item
    # Should match the number of created meta-texts (may include others if DB not isolated)
    created_titles = {"Meta 4", "Meta 5"}
    found_titles = set(titles)
    assert created_titles.issubset(found_titles)

def test_get_meta_text_success(client: TestClient, session: Session):
    doc = create_source_document(session)
    post_resp = client.post("/api/meta-text", json={"sourceDocId": doc.id, "title": "Meta 6"})
    meta_id = post_resp.json()["id"]
    response = client.get(f"/api/meta-text/{meta_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == meta_id
    assert data["title"] == "Meta 6"
    assert isinstance(data["chunks"], list)
    assert data["chunks"][0]["text"] == doc.text

def test_get_meta_text_not_found(client: TestClient):
    response = client.get("/api/meta-text/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Meta-text not found."

def test_delete_meta_text_success(client: TestClient, session):
    doc = create_source_document(session)
    # Create a meta-text
    post_resp = client.post("/api/meta-text", json={"sourceDocId": doc.id, "title": "Meta Delete"})
    meta_id = post_resp.json()["id"]
    # Delete the meta-text
    del_resp = client.delete(f"/api/meta-text/{meta_id}")
    assert del_resp.status_code == 200
    del_data = del_resp.json()
    assert del_data["success"] is True
    assert del_data["id"] == meta_id
    assert del_data["title"] == "Meta Delete"
    # Ensure it is deleted
    get_resp = client.get(f"/api/meta-text/{meta_id}")
    assert get_resp.status_code == 404
    assert get_resp.json()["detail"] == "Meta-text not found."
