"""Test the refactored source document service."""
import pytest
from unittest.mock import Mock, AsyncMock
from sqlmodel import Session

from backend.services.source_document_service import SourceDocumentService
from backend.services.text_processing_service import TextProcessingService
from backend.models import SourceDocument, MetaText
from backend.exceptions.source_document_exceptions import (
    SourceDocumentNotFoundError,
    SourceDocumentHasDependenciesError,
    SourceDocumentCreationError
)


class TestSourceDocumentService:
    """Test cases for SourceDocumentService."""
    
    def setup_method(self):
        """Set up test dependencies."""
        self.mock_session = Mock(spec=Session)
        self.mock_text_processing_service = Mock(spec=TextProcessingService)
        self.service = SourceDocumentService(self.mock_text_processing_service)
    
    def test_get_source_document_by_id_success(self):
        """Test successful source document retrieval."""
        # Arrange
        source_doc = SourceDocument(id=1, title="Test Doc", text="Test content")
        self.mock_session.get.return_value = source_doc
        
        # Act
        result = self.service.get_source_document_by_id(1, self.mock_session)
        
        # Assert
        assert result == source_doc
        self.mock_session.get.assert_called_once_with(SourceDocument, 1)
    
    def test_get_source_document_by_id_not_found(self):
        """Test source document retrieval when document doesn't exist."""
        # Arrange
        self.mock_session.get.return_value = None
        
        # Act & Assert
        with pytest.raises(SourceDocumentNotFoundError) as exc_info:
            self.service.get_source_document_by_id(999, self.mock_session)
        
        assert exc_info.value.doc_id == 999
    
    @pytest.mark.asyncio
    async def test_create_source_document_from_upload_success(self):
        """Test successful source document creation from upload."""
        # Arrange
        mock_file = AsyncMock()
        mock_file.filename = "test_document.txt"  # Set a valid filename with allowed extension
        mock_file.size = 1024  # Set a size within limits
        self.mock_text_processing_service.process_uploaded_file = AsyncMock(
            return_value="Processed text content"
        )
        self.mock_session.add = Mock()
        self.mock_session.commit = Mock()
        self.mock_session.refresh = Mock()
        
        # Mock the refresh to set the id
        def mock_refresh(doc):
            doc.id = 1
        self.mock_session.refresh.side_effect = mock_refresh
        
        # Act
        result = await self.service.create_source_document_from_upload(
            "Test Doc", mock_file, self.mock_session
        )
        
        # Assert
        self.mock_text_processing_service.process_uploaded_file.assert_called_once_with(mock_file)
        self.mock_session.add.assert_called_once()
        self.mock_session.commit.assert_called_once()
        self.mock_session.refresh.assert_called_once()
        assert result.title == "Test Doc"
        assert result.text == "Processed text content"
    
    @pytest.mark.asyncio
    async def test_create_source_document_from_upload_invalid_extension(self):
        """Test source document creation fails with invalid file extension."""
        # Arrange
        mock_file = AsyncMock()
        mock_file.filename = "test_document.pdf"  # Invalid extension
        mock_file.size = 1024
        
        # Act & Assert
        with pytest.raises(SourceDocumentCreationError) as exc_info:
            await self.service.create_source_document_from_upload(
                "Test Doc", mock_file, self.mock_session
            )
        
        # Should fail with SourceDocumentCreationError containing InvalidFileExtensionError message
        assert "File extension .pdf not allowed" in str(exc_info.value)
    
    @pytest.mark.asyncio
    async def test_create_source_document_from_upload_no_filename(self):
        """Test source document creation fails when filename is missing."""
        # Arrange
        mock_file = AsyncMock()
        mock_file.filename = None  # No filename
        mock_file.size = 1024
        
        # Act & Assert
        with pytest.raises(SourceDocumentCreationError) as exc_info:
            await self.service.create_source_document_from_upload(
                "Test Doc", mock_file, self.mock_session
            )
        
        # Should fail with SourceDocumentCreationError containing FileValidationError message
        assert "Filename is required" in str(exc_info.value)
    
    @pytest.mark.asyncio
    async def test_create_source_document_from_upload_file_too_large(self):
        """Test source document creation fails when file size exceeds limit."""
        # Arrange
        mock_file = AsyncMock()
        mock_file.filename = "test_document.txt"  # Valid extension
        mock_file.size = 11 * 1024 * 1024  # 11MB - exceeds 10MB limit
        
        # Act & Assert
        with pytest.raises(SourceDocumentCreationError) as exc_info:
            await self.service.create_source_document_from_upload(
                "Test Doc", mock_file, self.mock_session
            )
        
        # Should fail with SourceDocumentCreationError containing FileSizeExceededError message
        assert "File size" in str(exc_info.value) and "exceeds maximum allowed size" in str(exc_info.value)
    
    def test_delete_source_document_with_dependencies(self):
        """Test deletion fails when MetaText records exist."""
        # Arrange
        source_doc = SourceDocument(id=1, title="Test Doc", text="Test content")
        meta_texts = [
            MetaText(id=1, title="Meta 1", source_document_id=1, text="Text 1"), 
            MetaText(id=2, title="Meta 2", source_document_id=1, text="Text 2")
        ]
        
        self.mock_session.get.return_value = source_doc
        self.mock_session.exec.return_value.all.return_value = meta_texts
        
        # Act & Assert
        with pytest.raises(SourceDocumentHasDependenciesError) as exc_info:
            self.service.delete_source_document(1, self.mock_session)
        
        assert exc_info.value.doc_id == 1
        assert exc_info.value.meta_text_count == 2


class TestTextProcessingService:
    """Test cases for TextProcessingService."""
    
    def test_extract_between_stars_success(self):
        """Test successful text extraction between stars."""
        # Arrange
        text = "Header\n***\nContent line 1\nContent line 2\n***\nFooter"
        
        # Act
        result = TextProcessingService.extract_between_stars(text)
        
        # Assert
        assert result == "Content line 1\nContent line 2"
    
    def test_extract_between_stars_no_markers(self):
        """Test text extraction when no star markers exist."""
        # Arrange
        text = "Just some regular text without markers"
        
        # Act
        result = TextProcessingService.extract_between_stars(text)
        
        # Assert
        assert result == text
    
    def test_extract_between_stars_single_marker(self):
        """Test text extraction with only one star marker."""
        # Arrange
        text = "Header\n***\nContent\nMore content"
        
        # Act
        result = TextProcessingService.extract_between_stars(text)
        
        # Assert
        assert result == text


if __name__ == "__main__":
    pytest.main([__file__])
