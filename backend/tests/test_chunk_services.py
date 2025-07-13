"""Test the refactored chunk services."""
import pytest
from unittest.mock import Mock, patch
from sqlmodel import Session

from backend.services.chunk_service import ChunkService
from backend.models import Chunk, ChunkRead
from backend.exceptions.chunk_exceptions import (
    ChunkNotFoundError,
    InvalidSplitIndexError,
    ChunkCombineError
)


@pytest.fixture
def mock_session():
    """Create a mock session for testing."""
    return Mock(spec=Session)

@pytest.fixture
def chunk_service():
    """Provide a ChunkService instance for testing."""
    return ChunkService()


class TestChunkService:
    """Test cases for ChunkService."""
    
    def setup_method(self):
        """Set up test dependencies."""
        self.mock_session = Mock(spec=Session)
        self.chunk_service = ChunkService()
    
    def test_split_chunk_text(self):
        """Test text splitting functionality."""
        # Arrange
        text = "This is a test sentence"
        word_index = 3
        
        # Act
        before, after = ChunkService.split_chunk_text(text, word_index)
        
        # Assert
        assert before == "This is a"
        assert after == "test sentence"
    
    def test_update_chunk_fields(self):
        """Test chunk field updates."""
        # Arrange
        chunk = Mock(spec=Chunk)
        data = {
            "text": "new text",
            "summary": "new summary",
            "invalid_field": "should be ignored"
        }
        
        # Act
        ChunkService.update_chunk_fields(chunk, data)
        
        # Assert
        assert chunk.text == "new text"
        assert chunk.summary == "new summary"
        assert not hasattr(chunk, 'invalid_field')
    
    def test_get_chunk_by_id_success(self):
        """Test successful chunk retrieval."""
        # Arrange
        chunk = Mock(spec=Chunk)
        chunk.id = 1
        chunk.meta_text_id = 1
        self.mock_session.get.return_value = chunk
        
        # Act
        result = self.chunk_service.get_chunk_by_id(1, self.mock_session)
        
        # Assert
        assert result == chunk
        self.mock_session.get.assert_called_once_with(Chunk, 1)
    
    def test_get_chunk_by_id_not_found(self):
        """Test chunk retrieval when chunk doesn't exist."""
        # Arrange
        self.mock_session.get.return_value = None
        
        # Act & Assert
        with pytest.raises(ChunkNotFoundError) as exc_info:
            self.chunk_service.get_chunk_by_id(999, self.mock_session)
        
        assert exc_info.value.chunk_id == 999
    
    def test_get_chunk_with_images_not_found(self, mock_session):
        # Mock get_chunk_by_id to raise ChunkNotFoundError
        with patch.object(self.chunk_service, 'get_chunk_by_id', side_effect=ChunkNotFoundError(999)):
            with pytest.raises(ChunkNotFoundError):
                self.chunk_service.get_chunk_with_images(999, mock_session)

    def test_get_chunk_with_images_success(self, mock_session, monkeypatch):
        # Mock get_chunk_by_id
        mock_chunk = Mock(spec=Chunk)
        with patch.object(self.chunk_service, 'get_chunk_by_id', return_value=mock_chunk):
            # Mock ChunkRead.model_validate
            expected_result = Mock(spec=ChunkRead)
            mock_model_validate = Mock(return_value=expected_result)
            monkeypatch.setattr(ChunkRead, "model_validate", mock_model_validate)
            
            # Call the method
            result = self.chunk_service.get_chunk_with_images(1, mock_session)
            
            # Assertions
            assert result == expected_result
            mock_model_validate.assert_called_once_with(mock_chunk, from_attributes=True)
    
    def test_split_chunk_not_found(self, mock_session):
        with patch.object(self.chunk_service, 'get_chunk_by_id', side_effect=ChunkNotFoundError(999)):
            with pytest.raises(ChunkNotFoundError):
                self.chunk_service.split_chunk(999, 10, mock_session)

    def test_split_chunk_invalid_index(self, mock_session):
        mock_chunk = Chunk(id=1, text="word1 word2", meta_text_id=1)
        with patch.object(self.chunk_service, 'get_chunk_by_id', return_value=mock_chunk):
            with pytest.raises(InvalidSplitIndexError):
                self.chunk_service.split_chunk(1, 10, mock_session) # index out of bounds

    def test_split_chunk_success(self, mock_session):
        original_chunk = Chunk(id=1, text="This is a test sentence.", position=1.0, meta_text_id=1)
        
        # Mock session.exec for finding next chunk
        mock_result = Mock()
        mock_result.first.return_value = None  # No next chunk
        mock_session.exec.return_value = mock_result
        
        with patch.object(self.chunk_service, 'get_chunk_by_id', return_value=original_chunk):
            new_chunks = self.chunk_service.split_chunk(1, 4, mock_session)
            assert len(new_chunks) == 2
            assert new_chunks[0].text == "This is a test"
            assert new_chunks[1].text == "sentence."
            assert new_chunks[1].position > new_chunks[0].position
            mock_session.add.assert_called()
            mock_session.commit.assert_called()

    def test_combine_chunks_not_found(self, mock_session):
        # Mock session.get to return None for the chunk we want to test as not found
        mock_session.get.side_effect = [None, None]  # Both chunks not found
        
        with pytest.raises(ChunkNotFoundError):
            self.chunk_service.combine_chunks(1, 999, mock_session)

    def test_combine_chunks_not_adjacent(self, mock_session):
        chunk1 = Chunk(id=1, text="First part.", position=1.0, meta_text_id=1)
        chunk2 = Chunk(id=2, text="Second part.", position=3.0, meta_text_id=2)  # Different meta_text_id
        
        # Mock session.get to return the chunks
        mock_session.get.side_effect = [chunk1, chunk2]
        
        with pytest.raises(ChunkCombineError):
            self.chunk_service.combine_chunks(1, 2, mock_session)

    def test_combine_chunks_success(self, mock_session):
        chunk1 = Chunk(id=1, text="First part.", position=1.0, meta_text_id=1)
        chunk2 = Chunk(id=2, text="Second part.", position=2.0, meta_text_id=1)
        
        # Mock session.get to return the chunks
        mock_session.get.side_effect = [chunk1, chunk2]
        
        combined_chunk = self.chunk_service.combine_chunks(1, 2, mock_session)
        assert combined_chunk.text == "First part. Second part."
        mock_session.delete.assert_called_once_with(chunk2)
        mock_session.commit.assert_called()
        mock_session.refresh.assert_called_once_with(chunk1)

    def test_update_chunk_not_found(self, mock_session):
        with patch.object(self.chunk_service, 'get_chunk_by_id', side_effect=ChunkNotFoundError(999)):
            with pytest.raises(ChunkNotFoundError):
                self.chunk_service.update_chunk(999, {"notes": "new notes"}, mock_session)

    def test_update_chunk_success(self, mock_session):
        chunk = Chunk(id=1, text="Original text", notes="Old notes", meta_text_id=1)
        with patch.object(self.chunk_service, 'get_chunk_by_id', return_value=chunk):
            updated_chunk = self.chunk_service.update_chunk(1, {"notes": "New notes"}, mock_session)
            assert updated_chunk.notes == "New notes"
            mock_session.commit.assert_called()


if __name__ == "__main__":
    pytest.main([__file__])
