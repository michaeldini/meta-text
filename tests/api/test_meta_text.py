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

def test_create_meta_text_success(client, session):
    doc = create_source_document(session)
    payload = {"sourceTitle": doc.title, "newTitle": "Meta 1"}
    response = client.post("/api/meta-text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["title"] == "Meta 1"
    assert "id" in data

def test_create_meta_text_source_not_found(client):
    payload = {"sourceTitle": "Nonexistent", "newTitle": "Meta 2"}
    response = client.post("/api/meta-text", json=payload)
    assert response.status_code == 404
    assert response.json()["detail"] == "Source document not found."

def test_create_meta_text_duplicate_title(client, session):
    doc = create_source_document(session)
    payload = {"sourceTitle": doc.title, "newTitle": "Meta 3"}
    client.post("/api/meta-text", json=payload)
    response = client.post("/api/meta-text", json=payload)
    assert response.status_code == 409
    assert response.json()["detail"] == "Meta-text title already exists."

def test_list_meta_texts(client, session):
    doc = create_source_document(session)
    client.post("/api/meta-text", json={"sourceTitle": doc.title, "newTitle": "Meta 4"})
    client.post("/api/meta-text", json={"sourceTitle": doc.title, "newTitle": "Meta 5"})
    response = client.get("/api/meta-text")
    assert response.status_code == 200
    data = response.json()
    assert "meta_texts" in data
    assert len(data["meta_texts"]) == 2
    titles = [item["title"] for item in data["meta_texts"]]
    assert set(titles) == {"Meta 4", "Meta 5"}

def test_get_meta_text_success(client, session):
    doc = create_source_document(session)
    post_resp = client.post("/api/meta-text", json={"sourceTitle": doc.title, "newTitle": "Meta 6"})
    meta_id = post_resp.json()["id"]
    response = client.get(f"/api/meta-text/{meta_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == meta_id
    assert data["title"] == "Meta 6"
    assert isinstance(data["content"], list)
    assert data["content"][0]["content"] == doc.text

def test_get_meta_text_not_found(client):
    response = client.get("/api/meta-text/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Meta-text not found."

def test_update_meta_text_success(client, session):
    doc = create_source_document(session)
    post_resp = client.post("/api/meta-text", json={"sourceTitle": doc.title, "newTitle": "Meta 7"})
    meta_id = post_resp.json()["id"]
    new_sections = [
        {"content": "Section 1", "notes": "n1", "summary": "s1", "aiSummary": "a1", "aiImageUrl": "url1"},
        {"content": "Section 2", "notes": "n2", "summary": "s2", "aiSummary": "a2", "aiImageUrl": "url2"}
    ]
    response = client.put(f"/api/meta-text/{meta_id}", json=new_sections)
    assert response.status_code == 200
    assert response.json()["success"] is True
    # Check updated content
    get_resp = client.get(f"/api/meta-text/{meta_id}")
    content = get_resp.json()["content"]
    assert len(content) == 2
    assert content[0]["content"] == "Section 1"
    assert content[1]["content"] == "Section 2"

def test_update_meta_text_not_found(client):
    new_sections = [{"content": "Section X"}]
    response = client.put("/api/meta-text/9999", json=new_sections)
    assert response.status_code == 404
    assert response.json()["detail"] == "Meta-text not found."

def test_delete_meta_text_success(client, session):
    doc = create_source_document(session)
    post_resp = client.post("/api/meta-text", json={"sourceTitle": doc.title, "newTitle": "Meta 8"})
    meta_id = post_resp.json()["id"]
    response = client.delete(f"/api/meta-text/{meta_id}")
    assert response.status_code == 200
    assert response.json()["success"] is True
    # Confirm deletion
    get_resp = client.get(f"/api/meta-text/{meta_id}")
    assert get_resp.status_code == 404

def test_delete_meta_text_not_found(client):
    response = client.delete("/api/meta-text/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Meta-text not found."
