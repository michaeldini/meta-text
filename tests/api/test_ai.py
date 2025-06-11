# Tests for backend/api/ai.py
from fastapi import status
from unittest.mock import patch

from fastapi.testclient import TestClient
from sqlmodel import Session
from backend.models import Chunk, SourceDocument

# Note: These tests mock OpenAI and file reading to avoid external dependencies and side effects.

def create_chunk(session, text="chunk text", summary="summary", notes="notes", position=1.0):
    chunk = Chunk(meta_text_id=1, text=text, summary=summary, notes=notes, position=position)
    session.add(chunk)
    session.commit()
    session.refresh(chunk)
    return chunk

def create_source_doc(session, title="Doc", text="Text"):
    doc = SourceDocument(title=title, text=text)
    session.add(doc)
    session.commit()
    session.refresh(doc)
    return doc

@patch("backend.api.ai.client.responses.create")
def test_generate_chunk_note_summary_text_comparison_success(mock_create, client: TestClient, session: Session):
    chunk = create_chunk(session)
    mock_create.return_value.output_text = "AI comparison result"
    response = client.get(f"/api/generate-chunk-note-summary-text-comparison/{chunk.id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["result"] == "AI comparison result"

@patch("backend.api.ai.client.responses.create")
def test_generate_chunk_note_summary_text_comparison_not_found(mock_create, client: TestClient):
    response = client.get("/api/generate-chunk-note-summary-text-comparison/9999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Chunk not found."

@patch("backend.api.ai.client.responses.parse")
@patch("backend.api.ai.read_instructions_file", return_value="instructions")
def test_generate_definition_in_context_success(mock_read, mock_parse, client: TestClient, session: Session):
    class DummyAI:
        definition = "def"
        definitionWithContext = "defctx"
    mock_parse.return_value.output_parsed = DummyAI()
    payload = {"word": "test", "context": "ctx", "meta_text_id": 1}
    response = client.post("/api/generate-definition-in-context", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["definition"] == "def"
    assert data["definitionWithContext"] == "defctx"

@patch("backend.api.ai.client.responses.parse")
@patch("backend.api.ai.read_instructions_file", return_value="instructions")
def test_generate_definition_in_context_missing_word(mock_read, mock_parse, client: TestClient):
    payload = {"context": "ctx", "meta_text_id": 1}
    response = client.post("/api/generate-definition-in-context", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

@patch("backend.api.ai.client.responses.parse")
@patch("backend.api.ai.read_instructions_file", return_value="instructions")
def test_generate_definition_in_context_missing_meta_text_id(mock_read, mock_parse, client: TestClient):
    payload = {"word": "test", "context": "ctx"}
    response = client.post("/api/generate-definition-in-context", json=payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "Missing meta_text_id."

@patch("backend.api.ai.client.responses.parse")
@patch("backend.api.ai.read_instructions_file", return_value="instructions")
def test_generate_definition_in_context_ai_error(mock_read, mock_parse, client: TestClient):
    mock_parse.side_effect = Exception("AI error")
    payload = {"word": "test", "context": "ctx", "meta_text_id": 1}
    response = client.post("/api/generate-definition-in-context", json=payload)
    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert "OpenAI error" in response.json()["detail"]

@patch("backend.api.ai.client.responses.parse")
@patch("backend.api.ai.read_instructions_file", return_value="instructions")
def test_source_doc_info_missing_prompt(mock_read, mock_parse, client: TestClient):
    payload = {"id": 1, "prompt": ""}
    response = client.post("/api/source-doc-info", json=payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "Missing prompt."

@patch("backend.api.ai.client.responses.parse")
@patch("backend.api.ai.read_instructions_file", return_value="instructions")
def test_source_doc_info_doc_not_found(mock_read, mock_parse, client: TestClient):
    class DummyAI:
        summary = "sum"
        characters = ["a"]
        locations = ["b"]
        themes = ["c"]
        symbols = ["d"]
    mock_parse.return_value.output_parsed = DummyAI()
    payload = {"id": 9999, "prompt": "prompt"}
    response = client.post("/api/source-doc-info", json=payload)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Source document not found."

@patch("backend.api.ai.client.images.generate")
@patch("backend.api.ai.save_base64_image", return_value="generated_images/fake.png")
def test_generate_image_success(mock_save, mock_generate, client: TestClient, session: Session):
    class DummyImg:
        b64_json = "fakeb64"
    class DummyData:
        data = [DummyImg()]
    mock_generate.return_value = DummyData()
    response = client.post("/api/generate-image", data={"prompt": "draw a cat", "chunk_id": "1"})
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["prompt"] == "draw a cat"
    assert data["path"] == "generated_images/fake.png"

@patch("backend.api.ai.client.images.generate")
def test_generate_image_missing_prompt(mock_generate, client):
    response = client.post("/api/generate-image", data={"chunk_id": 1})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
