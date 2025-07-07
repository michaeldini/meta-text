"""Unit tests for AI services."""
import pytest
from unittest.mock import Mock, patch, mock_open
from sqlmodel import Session

from backend.services.openai_service import OpenAIService
from backend.services.file_service import FileService
from backend.services.ai_service import AIService
from backend.models import (
    Chunk, SourceDocument, AiImage,
    WordDefinitionResponse, WordDefinitionWithContextRequest,
    SourceDocInfoRequest, SourceDocInfoAiResponse
)
from backend.exceptions.ai_exceptions import (
    OpenAIClientError,
    OpenAIResponseParsingError,
    OpenAIImageGenerationError,
    InstructionsFileNotFoundError,
    FileOperationError,
    ChunkNotFoundError,
    WordDefinitionValidationError,
    SourceDocumentNotFoundError,
    PromptValidationError
)


class TestOpenAIService:
    """Test cases for OpenAIService."""
    
    def setup_method(self):
        """Setup test fixtures."""
        self.mock_client = Mock()
        self.service = OpenAIService(client=self.mock_client)
    
    def test_read_instructions_file_success(self):
        """Test successful instructions file reading."""
        mock_content = "Test instructions content"
        
        with patch("builtins.open", mock_open(read_data=mock_content)):
            result = self.service.read_instructions_file("test_instructions.txt")
        
        assert result == mock_content
    
    def test_read_instructions_file_not_found(self):
        """Test instructions file reading when file not found."""
        with patch("builtins.open", side_effect=FileNotFoundError()):
            with pytest.raises(InstructionsFileNotFoundError) as exc_info:
                self.service.read_instructions_file("nonexistent.txt")
        
        assert exc_info.value.filename == "nonexistent.txt"
    
    def test_extract_error_message_dict_arg(self):
        """Test error message extraction from dict argument."""
        error_dict = {"error": {"message": "Test error message"}}
        exception = Exception(error_dict)
        
        result = self.service.extract_error_message(exception)
        
        assert result == "Test error message"
    
    def test_extract_error_message_json_string(self):
        """Test error message extraction from JSON string."""
        error_json = '{"error": {"message": "JSON error message"}}'
        exception = Exception(error_json)
        
        result = self.service.extract_error_message(exception)
        
        assert result == "JSON error message"
    
    def test_extract_error_message_invalid_format(self):
        """Test error message extraction with invalid format."""
        exception = Exception("Simple error message")
        
        result = self.service.extract_error_message(exception)
        
        assert result is None
    
    def test_generate_text_response_success(self):
        """Test successful text response generation."""
        mock_instructions = "Test instructions"
        mock_response = Mock()
        mock_response.output_text = "Generated text response"
        
        self.mock_client.responses.create.return_value = mock_response
        
        with patch.object(self.service, 'read_instructions_file', return_value=mock_instructions):
            result = self.service.generate_text_response("test.txt", "test prompt")
        
        assert result == "Generated text response"
        self.mock_client.responses.create.assert_called_once_with(
            model="gpt-4o-mini-2024-07-18",
            instructions=mock_instructions,
            input="test prompt"
        )
    
    def test_generate_text_response_client_error(self):
        """Test text response generation with client error."""
        self.mock_client.responses.create.side_effect = Exception("API error")
        
        with patch.object(self.service, 'read_instructions_file', return_value="instructions"):
            with pytest.raises(OpenAIClientError) as exc_info:
                self.service.generate_text_response("test.txt", "test prompt")
        
        assert "API error" in str(exc_info.value)
    
    def test_generate_parsed_response_success(self):
        """Test successful parsed response generation."""
        mock_instructions = "Test instructions"
        mock_response = Mock()
        mock_parsed_data = WordDefinitionResponse(definition="test def", definitionWithContext="test context")
        mock_response.output_parsed = mock_parsed_data
        
        self.mock_client.responses.parse.return_value = mock_response
        
        with patch.object(self.service, 'read_instructions_file', return_value=mock_instructions):
            result = self.service.generate_parsed_response("test.txt", "test prompt", WordDefinitionResponse)
        
        assert result == mock_parsed_data
    
    def test_generate_parsed_response_parsing_error(self):
        """Test parsed response generation with parsing error."""
        mock_response = Mock()
        mock_response.output_parsed = None
        
        self.mock_client.responses.parse.return_value = mock_response
        
        with patch.object(self.service, 'read_instructions_file', return_value="instructions"):
            with pytest.raises(OpenAIResponseParsingError) as exc_info:
                self.service.generate_parsed_response("test.txt", "test prompt", WordDefinitionResponse)
        
        assert exc_info.value.response_format == "WordDefinitionResponse"
    
    def test_generate_image_success(self):
        """Test successful image generation."""
        mock_response = Mock()
        mock_image_data = Mock()
        mock_image_data.b64_json = "base64imagedata"
        mock_response.data = [mock_image_data]
        
        self.mock_client.images.generate.return_value = mock_response
        
        result = self.service.generate_image("test prompt")
        
        assert result == "base64imagedata"
        self.mock_client.images.generate.assert_called_once()
    
    def test_generate_image_no_data(self):
        """Test image generation when no data returned."""
        mock_response = Mock()
        mock_response.data = []
        
        self.mock_client.images.generate.return_value = mock_response
        
        with pytest.raises(OpenAIImageGenerationError) as exc_info:
            self.service.generate_image("test prompt")
        
        assert "No image data returned" in str(exc_info.value)
    
    def test_generate_image_client_error(self):
        """Test image generation with client error."""
        self.mock_client.images.generate.side_effect = Exception("Image generation failed")
        
        with pytest.raises(OpenAIImageGenerationError) as exc_info:
            self.service.generate_image("test prompt")
        
        assert "Image generation failed" in str(exc_info.value)


class TestFileService:
    """Test cases for FileService."""
    
    def setup_method(self):
        """Setup test fixtures."""
        self.service = FileService()
    
    @patch('os.makedirs')
    @patch('builtins.open', new_callable=mock_open)
    @patch('base64.b64decode')
    @patch('datetime.datetime')
    def test_save_base64_image_success(self, mock_datetime, mock_b64decode, mock_file, mock_makedirs):
        """Test successful base64 image saving."""
        # Setup mocks
        mock_datetime.now.return_value.strftime.return_value = "20240101120000123456"
        mock_b64decode.return_value = b"fake_image_data"
        
        result = self.service.save_base64_image("base64data")
        
        expected_path = "generated_images/ai_image_20240101120000123456.png"
        assert result == expected_path
        mock_b64decode.assert_called_once_with("base64data")
        mock_file.assert_called_once()
        mock_makedirs.assert_called_once()
    
    @patch('base64.b64decode')
    def test_save_base64_image_invalid_data(self, mock_b64decode):
        """Test base64 image saving with invalid data."""
        mock_b64decode.side_effect = Exception("Invalid base64")
        
        with pytest.raises(FileOperationError) as exc_info:
            self.service.save_base64_image("invalid_base64")
        
        assert exc_info.value.operation == "save"
        assert "Invalid base64" in exc_info.value.reason


class TestAIService:
    """Test cases for AIService."""
    
    def setup_method(self):
        """Setup test fixtures."""
        self.mock_openai_service = Mock(spec=OpenAIService)
        self.mock_file_service = Mock(spec=FileService)
        self.mock_session = Mock(spec=Session)
        self.service = AIService(
            openai_service=self.mock_openai_service,
            file_service=self.mock_file_service
        )
    
    def test_generate_chunk_comparison_success(self):
        """Test successful chunk comparison generation."""
        # Setup mock chunk
        chunk = Mock(spec=Chunk)
        chunk.text = "Test chunk text"
        chunk.summary = "Test summary"
        chunk.notes = "Test notes"
        
        self.mock_session.get.return_value = chunk
        self.mock_openai_service.generate_text_response.return_value = "AI comparison result"
        
        result = self.service.generate_chunk_comparison(1, self.mock_session)
        
        assert result == {"result": "AI comparison result"}
        assert chunk.comparison == "AI comparison result"
        self.mock_session.add.assert_called_once_with(chunk)
        self.mock_session.commit.assert_called_once()
    
    def test_generate_chunk_comparison_chunk_not_found(self):
        """Test chunk comparison when chunk not found."""
        self.mock_session.get.return_value = None
        
        with pytest.raises(ChunkNotFoundError) as exc_info:
            self.service.generate_chunk_comparison(999, self.mock_session)
        
        assert exc_info.value.chunk_id == 999
    
    def test_generate_word_definition_success(self):
        """Test successful word definition generation."""
        request = WordDefinitionWithContextRequest(
            word="test", 
            context="test context", 
            meta_text_id=1
        )
        
        mock_ai_response = WordDefinitionResponse(
            definition="test definition",
            definitionWithContext="test definition with context"
        )
        self.mock_openai_service.generate_parsed_response.return_value = mock_ai_response
        
        result = self.service.generate_word_definition(request, self.mock_session)
        
        assert result.definition == "test definition"
        assert result.definitionWithContext == "test definition with context"
        self.mock_session.add.assert_called_once()
        self.mock_session.commit.assert_called_once()
    
    def test_generate_word_definition_missing_word(self):
        """Test word definition with missing word."""
        request = WordDefinitionWithContextRequest(
            word="", 
            context="test context", 
            meta_text_id=1
        )
        
        with pytest.raises(WordDefinitionValidationError) as exc_info:
            self.service.generate_word_definition(request, self.mock_session)
        
        assert exc_info.value.field == "word"
        assert exc_info.value.message == "Missing word"
    
    def test_generate_word_definition_missing_meta_text_id(self):
        """Test word definition with missing meta_text_id."""
        request = WordDefinitionWithContextRequest(
            word="test", 
            context="test context", 
            meta_text_id=None
        )
        
        with pytest.raises(WordDefinitionValidationError) as exc_info:
            self.service.generate_word_definition(request, self.mock_session)
        
        assert exc_info.value.field == "meta_text_id"
        assert exc_info.value.message == "Missing meta_text_id"
    
    def test_generate_source_document_info_success(self):
        """Test successful source document info generation."""
        request = SourceDocInfoRequest(prompt="test prompt", id=1)
        
        mock_ai_response = SourceDocInfoAiResponse(
            summary="Test summary",
            characters=["Character 1"],
            locations=["Location 1"],
            themes=["Theme 1"],
            symbols=["Symbol 1"]
        )
        self.mock_openai_service.generate_parsed_response.return_value = mock_ai_response
        
        # Mock source document
        mock_doc = Mock(spec=SourceDocument)
        self.mock_session.get.return_value = mock_doc

        result = self.service.generate_source_document_info(mock_doc.id, self.mock_session)

        assert result.result == mock_ai_response
        assert mock_doc.summary == "Test summary"
        assert mock_doc.characters == "Character 1"
        self.mock_session.add.assert_called_once_with(mock_doc)
        self.mock_session.commit.assert_called_once()
    
    def test_generate_source_document_info_missing_prompt(self):
        """Test source document info with missing prompt."""
        request = SourceDocInfoRequest(prompt="", id=1)
        
        with pytest.raises(PromptValidationError) as exc_info:
            self.service.generate_source_document_info(1, self.mock_session)
        
        assert exc_info.value.message == "Missing prompt"
    
    def test_generate_source_document_info_doc_not_found(self):
        """Test source document info when document not found."""
        request = SourceDocInfoRequest(prompt="test prompt", id=999)
        
        mock_ai_response = SourceDocInfoAiResponse(
            summary="Test summary",
            characters=[],
            locations=[],
            themes=[],
            symbols=[]
        )
        self.mock_openai_service.generate_parsed_response.return_value = mock_ai_response
        self.mock_session.get.return_value = None
        
        with pytest.raises(SourceDocumentNotFoundError) as exc_info:
            self.service.generate_source_document_info(999, self.mock_session)

        assert exc_info.value.doc_id == 999
    
    def test_generate_image_success(self):
        """Test successful image generation."""
        self.mock_openai_service.generate_image.return_value = "base64imagedata"
        self.mock_file_service.save_base64_image.return_value = "generated_images/test.png"
        
        result = self.service.generate_image("test prompt", 1, self.mock_session)
        
        assert isinstance(result, AiImage)
        assert result.prompt == "test prompt"
        assert result.path == "generated_images/test.png"
        assert result.chunk_id == 1
        self.mock_session.add.assert_called_once()
        self.mock_session.commit.assert_called_once()
    
    def test_generate_image_missing_prompt(self):
        """Test image generation with missing prompt."""
        with pytest.raises(PromptValidationError) as exc_info:
            self.service.generate_image("", None, self.mock_session)
        
        assert exc_info.value.message == "Missing prompt"
    
    def test_ai_service_default_dependencies(self):
        """Test that AIService creates default dependencies when none provided."""
        with patch('backend.services.ai_service.OpenAIService') as mock_openai_service_class, \
             patch('backend.services.ai_service.FileService') as mock_file_service_class:
            
            mock_openai_instance = Mock()
            mock_file_instance = Mock()
            mock_openai_service_class.return_value = mock_openai_instance
            mock_file_service_class.return_value = mock_file_instance
            
            service = AIService()
            
            assert service.openai_service == mock_openai_instance
            assert service.file_service == mock_file_instance


if __name__ == "__main__":
    pytest.main([__file__])
