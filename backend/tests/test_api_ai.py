"""Tests for AI API endpoints."""
import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine

from backend.api.ai import router
from backend.models import (
    WordDefinitionResponse, SourceDocInfoResponse, AiImageRead,
    SourceDocInfoAiResponse
)
from backend.exceptions.ai_exceptions import (
    ChunkNotFoundError,
    WordDefinitionValidationError,
    SourceDocumentNotFoundError,
    PromptValidationError,
    OpenAIClientError,
    OpenAIImageGenerationError,
    FileOperationError
)


@pytest.fixture
def app():
    """Create a test FastAPI app."""
    app = FastAPI()
    app.include_router(router, prefix="/api")
    return app


@pytest.fixture
def client(app):
    """Create a test client."""
    return TestClient(app)


@pytest.fixture
def test_engine():
    """Create in-memory SQLite engine for testing."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture
def test_session(test_engine):
    """Create test database session."""
    with Session(test_engine) as session:
        yield session


@pytest.fixture
def mock_ai_service():
    """Mock AI service."""
    return Mock()


class TestAIEndpoints:
    """Test cases for AI API endpoints."""

    @patch('backend.api.ai.get_ai_service')
    @patch('backend.api.ai.get_session')
    def test_generate_chunk_note_summary_text_comparison_success(
        self, mock_get_session, mock_get_ai_service, client, test_session
    ):
        """Test successful chunk comparison generation."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service = Mock()
        mock_get_ai_service.return_value = mock_service
        expected_result = {
            "comparison": "This is a test comparison",
            "notes_analysis": "Notes are comprehensive",
            "summary_analysis": "Summary is accurate"
        }
        mock_service.generate_chunk_comparison.return_value = expected_result

        # Execute
        response = client.get("/api/generate-chunk-note-summary-text-comparison/1")

        # Assert
        assert response.status_code == 200
        assert response.json() == expected_result
        # Verify the service was called with the correct chunk ID
        mock_service.generate_chunk_comparison.assert_called_once()
        call_args = mock_service.generate_chunk_comparison.call_args
        assert call_args[0][0] == 1  # First argument should be chunk_id

    @patch('backend.api.ai.get_ai_service')
    @patch('backend.api.ai.get_session')
    def test_generate_chunk_comparison_chunk_not_found(
        self, mock_get_session, mock_get_ai_service, client, test_session
    ):
        """Test chunk comparison when chunk not found."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service = Mock()
        mock_get_ai_service.return_value = mock_service
        mock_service.generate_chunk_comparison.side_effect = ChunkNotFoundError(1)

        # Execute
        response = client.get("/api/generate-chunk-note-summary-text-comparison/1")

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Chunk not found"

    @patch('backend.api.ai.get_ai_service')
    @patch('backend.api.ai.get_session')
    def test_generate_chunk_comparison_openai_error(
        self, mock_get_session, mock_get_ai_service, client, test_session
    ):
        """Test chunk comparison with OpenAI error."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service = Mock()
        mock_get_ai_service.return_value = mock_service
        mock_service.generate_chunk_comparison.side_effect = OpenAIClientError("API key invalid")

        # Execute
        response = client.get("/api/generate-chunk-note-summary-text-comparison/1")

        # Assert
        assert response.status_code == 500
        assert "AI service error" in response.json()["detail"]

    @patch('backend.api.ai.get_ai_service')
    @patch('backend.api.ai.get_session')
    def test_generate_definition_in_context_success(
        self, mock_get_session, mock_get_ai_service, client, test_session
    ):
        """Test successful word definition generation."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service = Mock()
        mock_get_ai_service.return_value = mock_service
        expected_result = WordDefinitionResponse(
            definition="A test word definition",
            definitionWithContext="A test word definition in specific context"
        )
        mock_service.generate_word_definition.return_value = expected_result

        request_data = {
            "word": "test",
            "context": "This is a test context",
            "meta_text_id": 1
        }

        # Execute
        response = client.post("/api/generate-definition-in-context", json=request_data)

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["definition"] == expected_result.definition
        assert result["definitionWithContext"] == expected_result.definitionWithContext

    @patch('backend.api.ai.get_ai_service')
    @patch('backend.api.ai.get_session')
    def test_generate_definition_validation_error(
        self, mock_get_session, mock_get_ai_service, client, test_session
    ):
        """Test word definition with validation error."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service = Mock()
        mock_get_ai_service.return_value = mock_service
        mock_service.generate_word_definition.side_effect = WordDefinitionValidationError(
            "word", "Word cannot be empty"
        )

        request_data = {
            "word": "",
            "context": "This is a test context",
            "meta_text_id": 1
        }

        # Execute
        response = client.post("/api/generate-definition-in-context", json=request_data)

        # Assert
        assert response.status_code == 400
        assert "word" in response.json()["detail"]

    @patch('backend.api.ai.get_ai_service')
    @patch('backend.api.ai.get_session')
    def test_source_doc_info_success(
        self, mock_get_session, mock_get_ai_service, client, test_session
    ):
        """Test successful source document info generation."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service = Mock()
        mock_get_ai_service.return_value = mock_service
        
        ai_response = SourceDocInfoAiResponse(
            summary="Test summary",
            characters=["Character 1", "Character 2"],
            locations=["Location 1", "Location 2"],
            themes=["Theme 1", "Theme 2"],
            symbols=["Symbol 1", "Symbol 2"]
        )
        expected_result = SourceDocInfoResponse(result=ai_response)
        mock_service.generate_source_document_info.return_value = expected_result

        request_data = {
            "prompt": "Analyze this document",
            "id": 1
        }

        # Execute
        response = client.post("/api/source-doc-info", json=request_data)

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["result"]["summary"] == "Test summary"
        assert len(result["result"]["characters"]) == 2

    @patch('backend.api.ai.get_ai_service')
    @patch('backend.api.ai.get_session')
    def test_source_doc_info_prompt_validation_error(
        self, mock_get_session, mock_get_ai_service, client, test_session
    ):
        """Test source doc info with prompt validation error."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service = Mock()
        mock_get_ai_service.return_value = mock_service
        mock_service.generate_source_document_info.side_effect = PromptValidationError(
            "Prompt is too short"
        )

        request_data = {
            "prompt": "hi",
            "id": 1
        }

        # Execute
        response = client.post("/api/source-doc-info", json=request_data)

        # Assert
        assert response.status_code == 400
        assert "Prompt is too short" in response.json()["detail"]

    @patch('backend.api.ai.get_ai_service')
    @patch('backend.api.ai.get_session')
    def test_source_doc_info_not_found(
        self, mock_get_session, mock_get_ai_service, client, test_session
    ):
        """Test source doc info when document not found."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service = Mock()
        mock_get_ai_service.return_value = mock_service
        mock_service.generate_source_document_info.side_effect = SourceDocumentNotFoundError(1)

        request_data = {
            "prompt": "Analyze this document",
            "id": 1
        }

        # Execute
        response = client.post("/api/source-doc-info", json=request_data)

        # Assert
        assert response.status_code == 404
        assert response.json()["detail"] == "Source document not found"

    @patch('backend.api.ai.get_ai_service')
    @patch('backend.api.ai.get_session')
    def test_generate_image_success(
        self, mock_get_session, mock_get_ai_service, client, test_session
    ):
        """Test successful image generation."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service = Mock()
        mock_get_ai_service.return_value = mock_service
        expected_result = AiImageRead(
            id=1,
            prompt="A beautiful landscape",
            path="/path/to/image.jpg",
            chunk_id=1
        )
        mock_service.generate_image.return_value = expected_result

        # Execute
        response = client.post(
            "/api/generate-image", 
            data={"prompt": "A beautiful landscape", "chunk_id": "1"}
        )

        # Assert
        assert response.status_code == 200
        result = response.json()
        assert result["prompt"] == "A beautiful landscape"
        assert result["chunk_id"] == 1

    @patch('backend.api.ai.get_ai_service')
    @patch('backend.api.ai.get_session')
    def test_generate_image_prompt_validation_error(
        self, mock_get_session, mock_get_ai_service, client, test_session
    ):
        """Test image generation with prompt validation error."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service = Mock()
        mock_get_ai_service.return_value = mock_service
        mock_service.generate_image.side_effect = PromptValidationError(
            "Prompt must be at least 10 characters"
        )

        # Execute
        response = client.post(
            "/api/generate-image", 
            data={"prompt": "hi", "chunk_id": "1"}
        )

        # Assert
        assert response.status_code == 400
        assert "Prompt must be at least 10 characters" in response.json()["detail"]

    @patch('backend.api.ai.get_ai_service')
    @patch('backend.api.ai.get_session')
    def test_generate_image_openai_error(
        self, mock_get_session, mock_get_ai_service, client, test_session
    ):
        """Test image generation with OpenAI error."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service = Mock()
        mock_get_ai_service.return_value = mock_service
        mock_service.generate_image.side_effect = OpenAIImageGenerationError(
            "Failed to generate image"
        )

        # Execute
        response = client.post(
            "/api/generate-image", 
            data={"prompt": "A beautiful landscape", "chunk_id": "1"}
        )

        # Assert
        assert response.status_code == 500
        assert "Failed to generate image" in response.json()["detail"]

    @patch('backend.api.ai.get_ai_service')
    @patch('backend.api.ai.get_session')
    def test_generate_image_file_operation_error(
        self, mock_get_session, mock_get_ai_service, client, test_session
    ):
        """Test image generation with file operation error."""
        # Setup
        mock_get_session.return_value = test_session
        mock_service = Mock()
        mock_get_ai_service.return_value = mock_service
        mock_service.generate_image.side_effect = FileOperationError(
            "save", "image.jpg", "Failed to save image file"
        )

        # Execute
        response = client.post(
            "/api/generate-image", 
            data={"prompt": "A beautiful landscape", "chunk_id": "1"}
        )

        # Assert
        assert response.status_code == 500
        assert "Failed to save image file" in response.json()["detail"]

    def test_get_ai_service_lazy_initialization(self):
        """Test that AI service is lazily initialized."""
        from backend.api.ai import get_ai_service
        
        # Reset global service
        import backend.api.ai
        backend.api.ai._ai_service = None
        
        # First call should create service
        service1 = get_ai_service()
        assert service1 is not None
        
        # Second call should return same instance
        service2 = get_ai_service()
        assert service1 is service2
