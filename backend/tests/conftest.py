"""Shared pytest configuration for API tests using a persistent SQLite test database."""
import os
import pytest
from sqlmodel import Session, SQLModel, create_engine
import backend.db
from backend.main import app
from backend.models import SourceDocument, Metatext, User

TEST_DB_PATH = "test_database.sqlite"
TEST_DB_URL = f"sqlite:///{TEST_DB_PATH}"

@pytest.fixture(scope="session")
def test_engine():
    """Create a persistent SQLite engine for all tests."""
    # Remove any existing test DB file before starting
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)
    engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    return engine

def sample_user_data():
    """Sample user data for testing."""
    return {
        "username": "testuser",
        "password": "testpassword123"
    }


@pytest.fixture
def sample_source_document_data():
    """Sample source document data for testing."""
    return {
        "id": 1,
        "user_id": 1,
        "title": "Test Document",
        "author": "Test Author",
        "summary": "Test Summary",
        "characters": "Test Characters",
        "locations": "Test Locations", 
        "themes": "Test Themes",
        "symbols": "Test Symbols",
        "text": "This is test document content."
    }


# Fixture to create a MetaText for chunk tests
@pytest.fixture(autouse=True)
def metatext(test_engine):
    """Create a MetaText with id=1 and source_document_id=1 for chunk tests."""
    with Session(test_engine) as session:
        # Check if already exists
        metatext = session.get(Metatext, 1)
        if not metatext:
            metatext = Metatext(id=1, title="Test MetaText", source_document_id=1,
                                user_id=1,
                                text="This is a test metatext.")
            session.add(metatext)
            session.commit()
    yield


@pytest.fixture
def sample_meta_text_data():
    """Sample metatext data for testing."""
    return {
        "id": 1,
        "title": "Test Meta Text",
        "source_document_id": 1
    }


@pytest.fixture
def sample_chunk_data():
    """Sample chunk data for testing."""
    return {
        "id": 1,
        "text": "Test chunk content",
        "position": 1.0,
        "notes": "Test notes",
        "summary": "Test summary",
        "comparison": "",
        "meta_text_id": 1
    }


@pytest.fixture
def sample_ai_image_data():
    """Sample AI image data for testing."""
    return {
        "id": 1,
        "prompt": "A beautiful test image",
        "path": "/path/to/test/image.jpg",
        "chunk_id": 1
    }


@pytest.fixture
def sample_word_definition_data():
    """Sample word definition data for testing."""
    return {
        "id": 1,
        "word": "test",
        "context": "This is a test context",
        "definition": "A procedure to check something",
        "definition_with_context": "In this context, test means verification",
        "meta_text_id": 1
    }




@pytest.fixture(autouse=True)
def override_get_session(test_engine):
    """Override the get_session dependency to use the persistent test engine for all tests."""
    def get_test_session():
        with Session(test_engine) as session:
            yield session
    app.dependency_overrides[backend.db.get_session] = get_test_session
    yield
    app.dependency_overrides[backend.db.get_session] = backend.db.get_session


@pytest.fixture(autouse=True)
def reset_test_db(test_engine):
    """Reset the test DB before each test for isolation and re-insert SourceDocument."""
    SQLModel.metadata.drop_all(test_engine)
    SQLModel.metadata.create_all(test_engine)
    # Insert User with id=1, then SourceDocument with id=1 after tables are created
    with Session(test_engine) as session:
        user = User(id=1, username="testuser", hashed_password="fakehash")
        session.add(user)
        session.commit()
        doc = SourceDocument(user_id=1, id=1, title="Test Document", author="Test Author", summary="Test Summary", characters="", locations="", themes="", symbols="", text="Test text")
        session.add(doc)
        session.commit()
    yield


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_db(request):
    """Remove the test database file after all tests complete."""
    def remove_db():
        if os.path.exists(TEST_DB_PATH):
            os.remove(TEST_DB_PATH)
    request.addfinalizer(remove_db)
