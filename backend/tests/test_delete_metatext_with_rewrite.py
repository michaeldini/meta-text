import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.dependencies import get_current_user
from sqlmodel import Session, select
from backend.models import Rewrite, Chunk, Metatext

# Override current user dependency

def override_get_current_user():
    class User:
        id = 1
        username = "testuser"
    return User()

app.dependency_overrides[get_current_user] = override_get_current_user
client = TestClient(app)


def test_delete_metatext_with_rewrite(session_fixture=None):
    # Re-apply user dependency override in case another test cleared overrides
    from backend.dependencies import get_current_user as real_get_current_user
    app.dependency_overrides[real_get_current_user] = override_get_current_user
    # Create a metatext
    resp = client.post("/api/metatext", json={"title": "CascadeTest", "sourceDocId": 1})
    assert resp.status_code in (200, 201)
    metatext_id = resp.json()["id"]

    # Fetch metatext to get a chunk id
    detail = client.get(f"/api/metatext/{metatext_id}")
    assert detail.status_code == 200
    chunks = detail.json().get("chunks", [])
    assert chunks, "Expected at least one chunk to exist"
    chunk_id = chunks[0]["id"]

    # Manually insert a rewrite tied to the chunk using overridden test session
    # (Avoids hitting external AI dependencies.)
    from backend.db import get_session as original_get_session  # to reuse override
    get_session_override = app.dependency_overrides[original_get_session]
    with next(get_session_override()) as session:  # type: ignore
        # Ensure chunk exists
        chunk = session.exec(select(Chunk).where(Chunk.id == chunk_id)).first()
        assert chunk is not None, "Expected chunk to exist in DB"
        rw = Rewrite(title="like im 5", rewrite_text="simplified", chunk_id=chunk_id)
        session.add(rw)
        session.commit()
        session.refresh(rw)
        rewrite_id = rw.id
        assert rewrite_id is not None

    # Delete the metatext (should cascade and remove rewrite without IntegrityError)
    del_resp = client.delete(f"/api/metatext/{metatext_id}")
    assert del_resp.status_code == 200
    body = del_resp.json()
    assert body.get("success") is True

    # Attempt to retrieve metatext again should 404
    missing = client.get(f"/api/metatext/{metatext_id}")
    assert missing.status_code == 404

    # (Optional) There's no direct endpoint for rewrite retrieval; rely on absence of errors.
