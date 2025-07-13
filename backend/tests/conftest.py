"""Shared pytest configuration for API tests."""
import pytest
from sqlmodel import Session, SQLModel, create_engine
from fastapi import FastAPI
from fastapi.testclient import TestClient


@pytest.fixture(scope="session")
def test_engine():
    """Create an in-memory SQLite engine for testing."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture
def test_session(test_engine):
    """Create a test database session."""
    with Session(test_engine) as session:
        yield session


@pytest.fixture
def test_app():
    """Create a test FastAPI application."""
    app = FastAPI(title="Test API")
    return app


@pytest.fixture
def test_client(test_app):
    """Create a test client for the FastAPI application."""
    return TestClient(test_app)


# Common test data
@pytest.fixture
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
        "title": "Test Document",
        "author": "Test Author",
        "summary": "Test Summary",
        "characters": "Test Characters",
        "locations": "Test Locations", 
        "themes": "Test Themes",
        "symbols": "Test Symbols",
        "text": "This is test document content."
    }


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
