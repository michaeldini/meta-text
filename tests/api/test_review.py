# Tests for backend/api/review.py
from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session
from backend.models import WordDefinition, Chunk

def create_word_definition(session, meta_text_id=1, word="test", definition="A test word", context="", definition_with_context=""):
    wd = WordDefinition(meta_text_id=meta_text_id, word=word, definition=definition, context=context, definition_with_context=definition_with_context)
    session.add(wd)
    session.commit()
    session.refresh(wd)
    return wd

def create_chunk(session, meta_text_id=1, text="chunk text", position=1.0):
    chunk = Chunk(meta_text_id=meta_text_id, text=text, position=position)
    session.add(chunk)
    session.commit()
    session.refresh(chunk)
    return chunk

def test_get_wordlist_success(client: TestClient, session: Session):
    create_word_definition(session, meta_text_id=99, word="alpha", definition="first letter", context="context1", definition_with_context="defctx1")
    create_word_definition(session, meta_text_id=99, word="beta", definition="second letter", context="context2", definition_with_context="defctx2")
    response = client.get("/api/metatext/99/wordlist")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    words = [w["word"] for w in data]
    assert set(words) >= {"alpha", "beta"}

def test_get_wordlist_not_found(client: TestClient):
    response = client.get("/api/metatext/9999/wordlist")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "No words found in the wordlist for this metatext"

def test_get_chunk_summaries_notes_success(client: TestClient, session: Session):
    create_chunk(session, meta_text_id=77, text="A", position=1.0)
    create_chunk(session, meta_text_id=77, text="B", position=2.0)
    response = client.get("/api/metatext/77/chunk-summaries-notes")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    texts = [c["text"] for c in data]
    assert set(texts) >= {"A", "B"}

def test_get_chunk_summaries_notes_not_found(client: TestClient):
    response = client.get("/api/metatext/8888/chunk-summaries-notes")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "No chunks found for this metatext"
