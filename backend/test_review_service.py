"""Test the refactored review service."""
import pytest
from unittest.mock import Mock
from sqlmodel import Session

from backend.services.review_service import ReviewService
from backend.models import WordDefinition, Chunk
from backend.exceptions.review_exceptions import (
    WordlistNotFoundError,
    ChunksNotFoundError
)


class TestReviewService:
    """Test cases for ReviewService."""
    
    def setup_method(self):
        """Set up test dependencies."""
        self.mock_session = Mock(spec=Session)
        self.service = ReviewService()
    
    def test_get_wordlist_for_meta_text_success(self):
        """Test successful wordlist retrieval."""
        # Arrange
        mock_words = [
            WordDefinition(id=1, word="test", definition="a test", meta_text_id=1, context="test context", definition_with_context="test with context"),
            WordDefinition(id=2, word="word", definition="a word", meta_text_id=1, context="word context", definition_with_context="word with context")
        ]
        self.mock_session.exec.return_value.all.return_value = mock_words
        
        # Act
        result = self.service.get_wordlist_for_meta_text(1, self.mock_session)
        
        # Assert
        assert result == mock_words
        self.mock_session.exec.assert_called_once()
    
    def test_get_wordlist_for_meta_text_not_found(self):
        """Test wordlist retrieval when no words exist."""
        # Arrange
        self.mock_session.exec.return_value.all.return_value = []
        
        # Act & Assert
        with pytest.raises(WordlistNotFoundError) as exc_info:
            self.service.get_wordlist_for_meta_text(999, self.mock_session)
        
        assert exc_info.value.meta_text_id == 999
    
    def test_get_chunk_summaries_and_notes_success(self):
        """Test successful chunk retrieval."""
        # Arrange
        mock_chunks = [
            Chunk(id=1, text="chunk 1", position=0.0, meta_text_id=1),
            Chunk(id=2, text="chunk 2", position=1.0, meta_text_id=1)
        ]
        self.mock_session.exec.return_value.all.return_value = mock_chunks
        
        # Act
        result = self.service.get_chunk_summaries_and_notes(1, self.mock_session)
        
        # Assert
        assert result == mock_chunks
        self.mock_session.exec.assert_called_once()
    
    def test_get_chunk_summaries_and_notes_not_found(self):
        """Test chunk retrieval when no chunks exist."""
        # Arrange
        self.mock_session.exec.return_value.all.return_value = []
        
        # Act & Assert
        with pytest.raises(ChunksNotFoundError) as exc_info:
            self.service.get_chunk_summaries_and_notes(999, self.mock_session)
        
        assert exc_info.value.meta_text_id == 999
    
    def test_get_wordlist_summary_with_words(self):
        """Test wordlist summary when words exist."""
        # Arrange
        mock_words = [
            WordDefinition(id=1, word="Test", definition="a test", meta_text_id=1, context="test context", definition_with_context="test with context"),
            WordDefinition(id=2, word="word", definition="a word", meta_text_id=1, context="word context", definition_with_context="word with context"),
            WordDefinition(id=3, word="test", definition="another test", meta_text_id=1, context="test context 2", definition_with_context="test with context 2")  # duplicate word (different case)
        ]
        self.mock_session.exec.return_value.all.return_value = mock_words
        
        # Act
        result = self.service.get_wordlist_summary(1, self.mock_session)
        
        # Assert
        assert result["meta_text_id"] == 1
        assert result["total_words"] == 3
        assert result["unique_words"] == 2  # "test" and "word" (case insensitive)
        assert result["most_recent_word"] == "Test"
    
    def test_get_wordlist_summary_no_words(self):
        """Test wordlist summary when no words exist."""
        # Arrange
        self.mock_session.exec.return_value.all.return_value = []
        
        # Act
        result = self.service.get_wordlist_summary(999, self.mock_session)
        
        # Assert
        assert result["meta_text_id"] == 999
        assert result["total_words"] == 0
        assert result["unique_words"] == 0
        assert result["most_recent_word"] is None
    
    def test_get_chunks_summary_with_chunks(self):
        """Test chunks summary when chunks exist."""
        # Arrange
        mock_chunks = []
        
        # Create mock chunks with different completion states
        chunk1 = Mock(spec=Chunk)
        chunk1.summary = "summary 1"
        chunk1.notes = "notes 1"  
        chunk1.comparison = "comparison 1"
        mock_chunks.append(chunk1)
        
        chunk2 = Mock(spec=Chunk)
        chunk2.summary = "summary 2"
        chunk2.notes = None
        chunk2.comparison = None
        mock_chunks.append(chunk2)
        
        chunk3 = Mock(spec=Chunk)
        chunk3.summary = None
        chunk3.notes = "notes 3"
        chunk3.comparison = None
        mock_chunks.append(chunk3)
        
        chunk4 = Mock(spec=Chunk)
        chunk4.summary = None
        chunk4.notes = None
        chunk4.comparison = None
        mock_chunks.append(chunk4)
        
        self.mock_session.exec.return_value.all.return_value = mock_chunks
        
        # Act
        result = self.service.get_chunks_summary(1, self.mock_session)
        
        # Assert
        assert result["meta_text_id"] == 1
        assert result["total_chunks"] == 4
        assert result["chunks_with_summaries"] == 2
        assert result["chunks_with_notes"] == 2
        assert result["chunks_with_comparison"] == 1
        assert result["completion_percentage"]["summaries"] == 50.0
        assert result["completion_percentage"]["notes"] == 50.0
        assert result["completion_percentage"]["comparison"] == 25.0
    
    def test_get_chunks_summary_no_chunks(self):
        """Test chunks summary when no chunks exist."""
        # Arrange
        self.mock_session.exec.return_value.all.return_value = []
        
        # Act
        result = self.service.get_chunks_summary(999, self.mock_session)
        
        # Assert
        assert result["meta_text_id"] == 999
        assert result["total_chunks"] == 0
        assert result["chunks_with_summaries"] == 0
        assert result["chunks_with_notes"] == 0
        assert result["chunks_with_comparison"] == 0
        assert result["completion_percentage"]["summaries"] == 0
        assert result["completion_percentage"]["notes"] == 0
        assert result["completion_percentage"]["comparison"] == 0


if __name__ == "__main__":
    pytest.main([__file__])
