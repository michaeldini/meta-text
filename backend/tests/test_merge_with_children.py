"""
Regression test for combining chunks with strings and children.
- Creates two chunks with text and string fields.
- Adds rewrites and images to both.
- Combines and verifies string concatenation with a blank line and child counts reparented.
"""
from fastapi.testclient import TestClient
from backend.main import app
from backend.dependencies import get_current_user

# Mock user
class _User:
    id = 1
    username = "testuser"

def override_get_current_user():
    return _User()

# Apply dependency override for this module
app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)

def create_metatext():
    resp = client.post("/api/metatext", json={"title": "MergeTestMetaText", "sourceDocId": 1})
    assert resp.status_code in (200, 201), resp.text
    return resp.json()["id"]

def create_chunk(metatext_id: int, text: str, position: float, note: str, summary: str, evaluation: str, explanation: str):
    # create
    resp = client.post("/api/chunk", json={"text": text, "position": position, "metatextId": metatext_id})
    assert resp.status_code in (200, 201), resp.text
    chunk = resp.json()
    cid = chunk["id"]
    # update strings
    upd = {"note": note, "summary": summary, "evaluation": evaluation, "explanation": explanation}
    resp2 = client.put(f"/api/chunk/{cid}", json=upd)
    assert resp2.status_code == 200, resp2.text
    return cid


def add_rewrites_and_image(chunk_id: int):
    # Use AI endpoints to create rewrites and images
    # rewrites (2 styles)
    r1 = client.get(f"/api/generate-rewrite/{chunk_id}", params={"style_title": "like im 5"})
    assert r1.status_code == 200, r1.text
    r2 = client.get(f"/api/generate-rewrite/{chunk_id}", params={"style_title": "academic"})
    assert r2.status_code == 200, r2.text
    # image
    img = client.post("/api/generate-image", data={"prompt": f"img for {chunk_id}", "chunk_id": str(chunk_id)})
    assert img.status_code == 200, img.text


def test_merge_with_strings_and_children():
    metatext_id = create_metatext()

    # First chunk with strings + children
    c1 = create_chunk(
        metatext_id,
        text="First text",
        position=1,
        note="First note",
        summary="First summary",
        evaluation="First evaluation",
        explanation="First explanation",
    )
    add_rewrites_and_image(c1)

    # Second chunk with strings + children
    c2 = create_chunk(
        metatext_id,
        text="Second text",
        position=2,
        note="Second note",
        summary="Second summary",
        evaluation="Second evaluation",
        explanation="Second explanation",
    )
    add_rewrites_and_image(c2)

    # Combine starting at first chunk (service finds next adjacent)
    resp = client.post(f"/api/chunk/combine?first_chunk_id={c1}")
    assert resp.status_code == 200, resp.text
    data = resp.json()

    # Strings should be concatenated with a blank line between
    assert data["text"].startswith("First text") and data["text"].endswith("Second text")
    assert data["note"] == "First note\n\nSecond note"
    assert data["summary"] == "First summary\n\nSecond summary"
    assert data["evaluation"] == "First evaluation\n\nSecond evaluation"
    assert data["explanation"] == "First explanation\n\nSecond explanation"

    # Children should be appended (2 rewrites + 1 image from each => totals >= 4 rewrites, >= 2 images)
    # Fetch chunk back to get nested relations
    fetched = client.get(f"/api/chunk/{c1}").json()
    # rewrites may not be populated in combine response, ensure via get
    assert len(fetched.get("rewrites", [])) >= 4
    assert len(fetched.get("images", [])) >= 2
