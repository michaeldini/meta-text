"""Test the refactored chunk services."""
import pytest
from unittest.mock import Mock
from sqlmodel import Session

from backend.services.chunk_service import ChunkService
from backend.services.ai_image_service import AiImageService
from backend.models import Chunk, AiImage, ChunkWithImagesRead
from backend.exceptions.chunk_exceptions import (
    ChunkNotFoundError,
    InvalidSplitIndexError,
    ChunkCombineError,
    ChunkUpdateError,
    NoChunksFoundError
)


class TestChunkService:
    """Test cases for ChunkService."""
    
    def setup_method(self):
        """Set up test dependencies."""
        self.mock_session = Mock(spec=Session)
        self.mock_ai_image_service = Mock(spec=AiImageService)
        self.service = ChunkService(self.mock_ai_image_service)
    
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
        result = self.service.get_chunk_by_id(1, self.mock_session)
        
        # Assert
        assert result == chunk
        self.mock_session.get.assert_called_once_with(Chunk, 1)
    
    def test_get_chunk_by_id_not_found(self):
        """Test chunk retrieval when chunk doesn't exist."""
        # Arrange
        self.mock_session.get.return_value = None
        
        # Act & Assert
        with pytest.raises(ChunkNotFoundError) as exc_info:
            self.service.get_chunk_by_id(999, self.mock_session)
        
        assert exc_info.value.chunk_id == 999
    
    def test_get_chunk_with_images_success(self):
        """Test getting chunk with AI images."""
        # Arrange
        chunk = Mock(spec=Chunk)
        chunk.id = 1
        ai_images = [Mock(spec=AiImage), Mock(spec=AiImage)]
        
        self.mock_session.get.return_value = chunk
        self.mock_ai_image_service.get_all_images_for_chunk.return_value = ai_images
        
        # Mock ChunkWithImagesRead.model_validate
        expected_result = Mock(spec=ChunkWithImagesRead)
        with pytest.MonkeyPatch().context() as m:
            m.setattr(ChunkWithImagesRead, "model_validate", Mock(return_value=expected_result))
            
            # Act
            result = self.service.get_chunk_with_images(1, self.mock_session)
            
            # Assert
            assert result == expected_result
            self.mock_ai_image_service.get_all_images_for_chunk.assert_called_once_with(self.mock_session, 1)
    
    def test_get_all_chunks_for_meta_text_success(self):
        """Test getting all chunks for a meta-text."""
        # Arrange
        chunks = [Mock(spec=Chunk), Mock(spec=Chunk)]
        chunks[0].id = 1
        chunks[1].id = 2
        chunk_ids = [1, 2]
        images_by_chunk = {1: [Mock(spec=AiImage)], 2: []}
        
        self.mock_session.exec.return_value.all.return_value = chunks
        self.mock_ai_image_service.get_images_for_chunks.return_value = images_by_chunk
        
        # Mock ChunkWithImagesRead.model_validate
        expected_results = [Mock(spec=ChunkWithImagesRead), Mock(spec=ChunkWithImagesRead)]
        with pytest.MonkeyPatch().context() as m:
            mock_validate = Mock(side_effect=expected_results)
            m.setattr(ChunkWithImagesRead, "model_validate", mock_validate)
            
            # Act
            result = self.service.get_all_chunks_for_meta_text(1, self.mock_session)
            
            # Assert
            assert result == expected_results
            self.mock_ai_image_service.get_images_for_chunks.assert_called_once_with(self.mock_session, chunk_ids)
    
    def test_get_all_chunks_for_meta_text_no_chunks(self):
        """Test getting chunks when none exist."""
        # Arrange
        self.mock_session.exec.return_value.all.return_value = []
        
        # Act & Assert
        with pytest.raises(NoChunksFoundError) as exc_info:
            self.service.get_all_chunks_for_meta_text(999, self.mock_session)
        
        assert exc_info.value.meta_text_id == 999
    
    def test_split_chunk_success(self):
        """Test successful chunk splitting."""
        # Arrange
        chunk = Mock(spec=Chunk)
        chunk.id = 1
        chunk.text = "This is a test sentence"
        chunk.position = 1.0
        chunk.meta_text_id = 1
        
        self.mock_session.get.return_value = chunk
        self.mock_session.exec.return_value.first.return_value = None  # No next chunk
        self.mock_session.add = Mock()
        self.mock_session.commit = Mock()
        self.mock_session.refresh = Mock()
        
        # Act
        result = self.service.split_chunk(1, 3, self.mock_session)
        
        # Assert
        assert len(result) == 2
        assert chunk.text == "This is a"
        self.mock_session.add.assert_called_once()
        self.mock_session.commit.assert_called_once()
    
    def test_split_chunk_invalid_index(self):
        """Test chunk splitting with invalid index."""
        # Arrange
        chunk = Mock(spec=Chunk)
        chunk.id = 1
        chunk.text = "This is a test"  # 4 words
        
        self.mock_session.get.return_value = chunk
        
        # Act & Assert - word index too high
        with pytest.raises(InvalidSplitIndexError) as exc_info:
            self.service.split_chunk(1, 5, self.mock_session)
        
        assert exc_info.value.chunk_id == 1
        assert exc_info.value.word_index == 5
        assert exc_info.value.max_words == 4
        
        # Act & Assert - word index too low
        with pytest.raises(InvalidSplitIndexError):
            self.service.split_chunk(1, 0, self.mock_session)
    
    def test_combine_chunks_success(self):
        """Test successful chunk combination."""
        # Arrange
        first_chunk = Mock(spec=Chunk)
        first_chunk.id = 1
        first_chunk.text = "First chunk"
        first_chunk.position = 1.0
        first_chunk.meta_text_id = 1
        
        second_chunk = Mock(spec=Chunk)
        second_chunk.id = 2
        second_chunk.text = "Second chunk"
        second_chunk.position = 2.0
        second_chunk.meta_text_id = 1
        
        self.mock_session.get.side_effect = [first_chunk, second_chunk]
        self.mock_session.delete = Mock()
        self.mock_session.commit = Mock()
        self.mock_session.refresh = Mock()
        
        # Act
        result = self.service.combine_chunks(1, 2, self.mock_session)
        
        # Assert
        assert result == first_chunk
        assert first_chunk.text == "First chunk Second chunk"
        self.mock_session.delete.assert_called_once_with(second_chunk)
        self.mock_session.commit.assert_called_once()
    
    def test_combine_chunks_different_meta_texts(self):
        """Test chunk combination fails when chunks belong to different meta-texts."""
        # Arrange
        first_chunk = Mock(spec=Chunk)
        first_chunk.id = 1
        first_chunk.meta_text_id = 1
        
        second_chunk = Mock(spec=Chunk)
        second_chunk.id = 2
        second_chunk.meta_text_id = 2
        
        self.mock_session.get.side_effect = [first_chunk, second_chunk]
        
        # Act & Assert
        with pytest.raises(ChunkCombineError) as exc_info:
            self.service.combine_chunks(1, 2, self.mock_session)
        
        assert "different meta-texts" in str(exc_info.value)
    
    def test_update_chunk_success(self):
        """Test successful chunk update."""
        # Arrange
        chunk = Mock(spec=Chunk)
        chunk.id = 1
        
        self.mock_session.get.return_value = chunk
        self.mock_session.add = Mock()
        self.mock_session.commit = Mock()
        self.mock_session.refresh = Mock()
        
        chunk_data = {"text": "Updated text", "summary": "Updated summary"}
        
        # Act
        result = self.service.update_chunk(1, chunk_data, self.mock_session)
        
        # Assert
        assert result == chunk
        assert chunk.text == "Updated text"
        assert chunk.summary == "Updated summary"
        self.mock_session.commit.assert_called_once()


class TestAiImageService:
    """Test cases for AiImageService."""
    
    def setup_method(self):
        """Set up test dependencies."""
        self.mock_session = Mock(spec=Session)
        self.service = AiImageService()
    
    def test_get_latest_image_for_chunk_success(self):
        """Test getting latest image for a chunk."""
        # Arrange
        latest_image = Mock(spec=AiImage)
        self.mock_session.exec.return_value.first.return_value = latest_image
        
        # Act
        result = self.service.get_latest_image_for_chunk(self.mock_session, 1)
        
        # Assert
        assert result == latest_image
        self.mock_session.exec.assert_called_once()
    
    def test_get_latest_image_for_chunk_none(self):
        """Test getting latest image when none exists."""
        # Arrange
        self.mock_session.exec.return_value.first.return_value = None
        
        # Act
        result = self.service.get_latest_image_for_chunk(self.mock_session, 1)
        
        # Assert
        assert result is None
    
    def test_get_all_images_for_chunk(self):
        """Test getting all images for a chunk."""
        # Arrange
        images = [Mock(spec=AiImage), Mock(spec=AiImage)]
        self.mock_session.exec.return_value.all.return_value = images
        
        # Act
        result = self.service.get_all_images_for_chunk(self.mock_session, 1)
        
        # Assert
        assert result == images
        self.mock_session.exec.assert_called_once()
    
    def test_get_images_for_chunks_success(self):
        """Test getting images for multiple chunks."""
        # Arrange
        chunk_ids = [1, 2, 3]
        images = [
            Mock(spec=AiImage, chunk_id=1),
            Mock(spec=AiImage, chunk_id=1),
            Mock(spec=AiImage, chunk_id=2),
        ]
        self.mock_session.exec.return_value.all.return_value = images
        
        # Act
        result = self.service.get_images_for_chunks(self.mock_session, chunk_ids)
        
        # Assert
        assert result[1] == images[:2]  # First two images for chunk 1
        assert result[2] == [images[2]]  # One image for chunk 2
        assert result[3] == []  # No images for chunk 3
        assert len(result) == 3
    
    def test_get_images_for_chunks_empty_list(self):
        """Test getting images for empty chunk list."""
        # Act
        result = self.service.get_images_for_chunks(self.mock_session, [])
        
        # Assert
        assert result == {}


if __name__ == "__main__":
    pytest.main([__file__])
