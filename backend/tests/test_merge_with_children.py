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

# Apply dependency override for this module in setup/teardown to avoid being cleared by other modules
def setup_module(module):
    app.dependency_overrides[get_current_user] = override_get_current_user

def teardown_module(module):
    app.dependency_overrides = {}

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
        """
        Seed two rewrites and one image for a chunk without hitting AI endpoints.

        You may optionally place fixture files that will be used if present:
        - Rewrite texts:
            backend/tests/fixtures/rewrites/like_im_5.txt
            backend/tests/fixtures/rewrites/academic.txt
        - Image file (any valid PNG placed here will be referenced):
            public/generated_images/test_img_{chunk_id}.png

        If fixture files are missing, fallback placeholder content is inserted.
        """
        import os
        from pathlib import Path
        from sqlmodel import Session, create_engine
        from backend.models import Rewrite, Image

        # Try to read rewrite texts from optional fixtures
        tests_dir = Path(__file__).parent
        like_im_5_path = tests_dir / "fixtures" / "rewrites" / "like_im_5.txt"
        academic_path = tests_dir / "fixtures" / "rewrites" / "academic.txt"

        def _read_or_placeholder(p: Path, default: str) -> str:
                try:
                        if p.is_file():
                                return p.read_text(encoding="utf-8").strip() or default
                except Exception:
                        pass
                return default

        rtext1 = _read_or_placeholder(like_im_5_path, f"Rewrite (like im 5) for chunk {chunk_id}")
        rtext2 = _read_or_placeholder(academic_path, f"Rewrite (academic) for chunk {chunk_id}")

        # Use a predictable relative path for the image under public/generated_images
        # (The file can be pre-placed by the test environment; existence is not enforced here.)
        rel_image_path = f"generated_images/test_img_{chunk_id}.png"
        abs_image_dir = Path(__file__).resolve().parents[3] / "public" / "generated_images"
        # Ensure folder exists to make it easy to drop a file there (no image content created)
        os.makedirs(abs_image_dir, exist_ok=True)

        # Use the same persistent test DB as configured in backend/tests/conftest.py
        test_db_url = "sqlite:///test_database.sqlite"
        engine = create_engine(test_db_url, connect_args={"check_same_thread": False})
        with Session(engine) as session:
                session.add(Rewrite(title="like im 5", rewrite_text=rtext1, chunk_id=chunk_id))
                session.add(Rewrite(title="academic", rewrite_text=rtext2, chunk_id=chunk_id))
                session.add(Image(prompt=f"img for {chunk_id}", path=rel_image_path, chunk_id=chunk_id))
                session.commit()


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
