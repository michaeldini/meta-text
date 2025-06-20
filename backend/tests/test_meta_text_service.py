"""Test the refactored meta-text service."""
import pytest
from unittest.mock import Mock
from sqlmodel import Session

from backend.services.meta_text_service import MetaTextService
from backend.services.text_chunking_service import TextChunkingService
from backend.models import SourceDocument
from backend.exceptions.meta_text_exceptions import (
    SourceDocumentNotFoundError,
    MetaTextNotFoundError
)


class TestMetaTextService:
    """Test cases for MetaTextService."""
    
    def setup_method(self):
        """Set up test dependencies."""
        self.mock_session = Mock(spec=Session)
        self.mock_chunking_service = Mock(spec=TextChunkingService)
        self.service = MetaTextService(self.mock_chunking_service)
    
    def test_validate_source_document_exists_success(self):
        """Test successful source document validation."""
        # Arrange
        source_doc = SourceDocument(id=1, title="Test Doc", text="Test content")
        self.mock_session.exec.return_value.first.return_value = source_doc
        
        # Act
        result = self.service.validate_source_document_exists(1, self.mock_session)
        
        # Assert
        assert result == source_doc
        self.mock_session.exec.assert_called_once()
    
    def test_validate_source_document_not_found(self):
        """Test source document validation when document doesn't exist."""
        # Arrange
        self.mock_session.exec.return_value.first.return_value = None
        
        # Act & Assert
        with pytest.raises(SourceDocumentNotFoundError) as exc_info:
            self.service.validate_source_document_exists(999, self.mock_session)
        
        assert exc_info.value.source_doc_id == 999
    
    def test_get_meta_text_by_id_not_found(self):
        """Test get meta-text when it doesn't exist."""
        # Arrange
        self.mock_session.exec.return_value.first.return_value = None
        
        # Act & Assert
        with pytest.raises(MetaTextNotFoundError) as exc_info:
            self.service.get_meta_text_by_id(999, self.mock_session)
        
        assert exc_info.value.meta_text_id == 999


if __name__ == "__main__":
    pytest.main([__file__])
