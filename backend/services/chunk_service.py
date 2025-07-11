"""Chunk service for business logic operations."""
from sqlmodel import select, Session
from loguru import logger

from backend.models import Chunk, ChunkRead
from backend.exceptions.chunk_exceptions import (
    ChunkNotFoundError,
    InvalidSplitIndexError,
    ChunkCombineError,
    ChunkUpdateError,
    NoChunksFoundError
)
from backend.services.ai_image_service import AiImageService


class ChunkService:
    """Service for chunk business logic operations."""
    
    def __init__(self, ai_image_service: AiImageService | None = None):
        self.ai_image_service = ai_image_service or AiImageService()
    
    @staticmethod
    def split_chunk_text(text: str, word_index: int) -> tuple[str, str]:
        """
        Split text at word_index into before and after strings.
        
        Args:
            text: The text to split
            word_index: Index where to split (0-based)
            
        Returns:
            Tuple of (before_text, after_text)
        """
        words = text.split()
        before = " ".join(words[:word_index])
        after = " ".join(words[word_index:])
        return before, after
    
    @staticmethod
    def update_chunk_fields(chunk: Chunk, data: dict) -> None:
        """
        Update chunk fields from a dictionary.
        
        Args:
            chunk: The chunk to update
            data: Dictionary of field updates
        """
        allowed_fields = ['text', 'summary', 'notes', 'comparison']
        for field in allowed_fields:
            if field in data:
                setattr(chunk, field, data[field])
    
    def get_chunk_by_id(self, chunk_id: int, session: Session) -> Chunk:
        """
        Get a chunk by ID.
        
        Args:
            chunk_id: The ID of the chunk
            session: Database session
            
        Returns:
            The chunk object
            
        Raises:
            ChunkNotFoundError: If chunk is not found
        """
        logger.info(f"Retrieving chunk with id: {chunk_id}")
        chunk = session.get(Chunk, chunk_id)
        if not chunk:
            logger.warning(f"Chunk not found: id={chunk_id}")
            raise ChunkNotFoundError(chunk_id)
        
        logger.debug(f"Chunk found: id={chunk.id}, meta_text_id={chunk.meta_text_id}")
        return chunk
    
    def get_chunk_with_images(self, chunk_id: int, session: Session) -> ChunkRead:
        """
        Get a chunk with its AI images.
        
        Args:
            chunk_id: The ID of the chunk
            session: Database session
            
        Returns:
            ChunkRead object
            
        Raises:
            ChunkNotFoundError: If chunk is not found
        """
        chunk = self.get_chunk_by_id(chunk_id, session)
        # The relationship should load the images automatically if configured with lazy='selectin' or similar
        # or we can manually validate it.
        return ChunkRead.model_validate(chunk, from_attributes=True)
    
    def get_all_chunks_for_meta_text(self, meta_text_id: int, session: Session) -> list[ChunkRead]:
        """
        Get all chunks for a meta-text with their AI images.
        
        Args:
            meta_text_id: The ID of the meta-text
            session: Database session
            
        Returns:
            List of ChunkRead objects ordered by position
            
        Raises:
            NoChunksFoundError: If no chunks are found
        """
        logger.info(f"Listing all chunks for meta_text_id: {meta_text_id}")
        
        chunks = list(session.exec(
            select(Chunk)
            .where(Chunk.meta_text_id == meta_text_id)
            .order_by(Chunk.position)  # type: ignore
        ).all())
        
        if not chunks:
            logger.warning(f"No chunks found for meta_text_id: {meta_text_id}")
            raise NoChunksFoundError(meta_text_id)
        
        return [ChunkRead.model_validate(chunk, from_attributes=True) for chunk in chunks]

    def split_chunk(self, chunk_id: int, word_index: int, session: Session) -> list[Chunk]:
        """
        Split a chunk at the specified word index.
        
        Args:
            chunk_id: The ID of the chunk to split
            word_index: The word index where to split (1-based)
            session: Database session
            
        Returns:
            List containing the original (modified) chunk and the new chunk
            
        Raises:
            ChunkNotFoundError: If chunk is not found
            InvalidSplitIndexError: If word index is invalid
        """
        logger.info(f"Splitting chunk id={chunk_id} at word_index={word_index}")
        
        chunk = self.get_chunk_by_id(chunk_id, session)
        
        # Validate split index
        words = chunk.text.split()
        if word_index <= 0 or word_index >= len(words):
            logger.warning(f"Invalid split index {word_index} for chunk id={chunk_id}")
            raise InvalidSplitIndexError(chunk_id, word_index, len(words))
        
        # Split the text
        before, after = self.split_chunk_text(chunk.text, word_index)
        chunk.text = before
        
        # Calculate position for new chunk
        next_chunk = session.exec(
            select(Chunk)
            .where(
                (Chunk.meta_text_id == chunk.meta_text_id) &
                (Chunk.position > chunk.position)
            )
            .order_by(Chunk.position)  # type: ignore
        ).first()
        
        if next_chunk:
            new_position = (chunk.position + next_chunk.position) / 2
        else:
            new_position = chunk.position + 1
        
        # Create new chunk
        new_chunk = Chunk(
            text=after,
            position=new_position,
            meta_text_id=chunk.meta_text_id
        )
        
        session.add(new_chunk)
        session.commit()
        session.refresh(chunk)
        session.refresh(new_chunk)
        
        logger.info(f"Chunk split successful: old_chunk_id={chunk.id}, new_chunk_id={new_chunk.id}")
        return [chunk, new_chunk]
    
    def combine_chunks(self, first_chunk_id: int, second_chunk_id: int, session: Session) -> Chunk:
        """
        Combine two chunks into one.
        
        Args:
            first_chunk_id: ID of the first chunk
            second_chunk_id: ID of the second chunk
            session: Database session
            
        Returns:
            The combined chunk
            
        Raises:
            ChunkNotFoundError: If either chunk is not found
            ChunkCombineError: If chunks cannot be combined
        """
        logger.info(f"Combining chunks: first_chunk_id={first_chunk_id}, second_chunk_id={second_chunk_id}")
        
        first = session.get(Chunk, first_chunk_id)
        second = session.get(Chunk, second_chunk_id)
        
        if not first:
            raise ChunkNotFoundError(first_chunk_id)
        if not second:
            raise ChunkNotFoundError(second_chunk_id)
        
        # Validate chunks are from same meta-text
        if first.meta_text_id != second.meta_text_id:
            raise ChunkCombineError(
                first_chunk_id, 
                second_chunk_id, 
                "chunks belong to different meta-texts"
            )
        
        # Ensure correct order (first should have lower position)
        if first.position > second.position:
            first, second = second, first
            first_chunk_id, second_chunk_id = second_chunk_id, first_chunk_id
        
        # Combine text
        first.text = f"{first.text} {second.text}"
        
        # Delete second chunk
        session.delete(second)
        session.commit()
        session.refresh(first)
        
        logger.info(f"Chunks combined successfully: kept_chunk_id={first.id}, deleted_chunk_id={second.id}")
        return first
    
    def update_chunk(self, chunk_id: int, chunk_data: dict, session: Session) -> Chunk:
        """
        Update a chunk with new data.
        
        Args:
            chunk_id: The ID of the chunk to update
            chunk_data: Dictionary of fields to update
            session: Database session
            
        Returns:
            The updated chunk
            
        Raises:
            ChunkNotFoundError: If chunk is not found
            ChunkUpdateError: If update fails
        """
        logger.info(f"Updating chunk with id: {chunk_id}")
        
        chunk = self.get_chunk_by_id(chunk_id, session)
        
        try:
            self.update_chunk_fields(chunk, chunk_data)
            session.add(chunk)
            session.commit()
            session.refresh(chunk)
            
            logger.info(f"Chunk updated successfully: id={chunk.id}")
            return chunk
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error updating chunk {chunk_id}: {e}")
            raise ChunkUpdateError(chunk_id, str(e))
