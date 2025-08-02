"""Chunk service for business logic operations."""
from sqlmodel import select, Session
from fastapi import HTTPException
from loguru import logger

from backend.models import Chunk, ChunkRead, Metatext, CreateChunk
from backend.exceptions.chunk_exceptions import (
    ChunkNotFoundError,
    InvalidSplitIndexError,
    ChunkCombineError,
    ChunkUpdateError
)
from backend.services.ai_image_service import AiImageService


class ChunkService:
    def create_chunk(self, chunk_data: CreateChunk, user_id: int, session: Session) -> Chunk:
        """
        Create a new chunk. metatextId must belong to the current user.
        Args:
            chunk_data: Dictionary containing chunk fields (must include text, position, metatextId)
            user_id: The ID of the user creating the chunk
            session: Database session
        Returns:
            The created Chunk object
        Raises:
            HTTPException: If required fields are missing or user is not authorized
        """
        # required_fields = ["text", "position", "metatextId"]
        # for field in required_fields:
        #     if field not in chunk_data:
        #         raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        metatext_id = chunk_data.metatextId
        metatext = session.exec(select(Metatext).where(Metatext.id == metatext_id)).first()
        if not metatext or metatext.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to add chunk to this Metatext.")
        chunk = Chunk(
            text=chunk_data.text,
            position=chunk_data.position,
            # note=chunk_data.note,
            # summary=chunk_data.summary,
            # evaluation=chunk_data.evaluation,
            # explanation=chunk_data.explanation,
            metatext_id=metatext_id
        )
        session.add(chunk)
        session.commit()
        session.refresh(chunk)
        return chunk
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
        allowed_fields = ['text', 'summary', 'note', 'evaluation', 'bookmarked_by_user_id']
        for field in allowed_fields:
            if field in data:
                setattr(chunk, field, data[field])
    
    def get_chunk_by_id(self, chunk_id: int, user_id: int, session: Session) -> Chunk:
        """
        Get a chunk by ID, ensuring it belongs to the given user.
        """
        logger.info(f"Retrieving chunk with id: {chunk_id} for user_id: {user_id}")
        chunk = session.get(Chunk, chunk_id)
        if not chunk:
            logger.warning(f"Chunk not found: id={chunk_id}")
            raise ChunkNotFoundError(chunk_id)
        # Enforce per-user access: chunk must belong to a Metatext owned by user_id
        metatext = session.get(Metatext, chunk.metatext_id)
        if not metatext or metatext.user_id != user_id:
            logger.warning(f"User {user_id} unauthorized for chunk {chunk_id}")
            raise ChunkNotFoundError(chunk_id)
        logger.debug(f"Chunk found: id={chunk.id}, metatext_id={chunk.metatext_id}")
        return chunk
    
    def get_chunk(self, chunk_id: int, user_id: int, session: Session) -> ChunkRead:
        """
        Get a chunk.
        
        Args:
            chunk_id: The ID of the chunk
            user_id: The ID of the user requesting the chunk
            session: Database session
            
        Returns:
            ChunkRead object
            
        Raises:
            ChunkNotFoundError: If chunk is not found
        """
        chunk = self.get_chunk_by_id(chunk_id, user_id, session)
        return ChunkRead.model_validate(chunk, from_attributes=True)

    def split_chunk(self, chunk_id: int, word_index: int, user_id: int, session: Session) -> list[Chunk]:
        """
        Split a chunk at the specified word index.
        
        Args:
            chunk_id: The ID of the chunk to split
            word_index: The word index where to split (1-based)
            user_id: The ID of the user requesting the split
            session: Database session
            
        Returns:
            List containing the original (modified) chunk and the new chunk
            
        Raises:
            ChunkNotFoundError: If chunk is not found
            InvalidSplitIndexError: If word index is invalid
        """
        logger.info(f"Splitting chunk id={chunk_id} at word_index={word_index} for user_id={user_id}")
        chunk = self.get_chunk_by_id(chunk_id, user_id, session)
        
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
                (Chunk.metatext_id == chunk.metatext_id) &
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
            metatext_id=chunk.metatext_id
        )
        
        session.add(new_chunk)
        session.commit()
        session.refresh(chunk)
        session.refresh(new_chunk)
        
        logger.info(f"Chunk split successful: old_chunk_id={chunk.id}, new_chunk_id={new_chunk.id}")
        return [chunk, new_chunk]
    
    def combine_chunks(self, first_chunk_id: int, second_chunk_id: int, user_id: int, session: Session) -> Chunk:
        """
        Combine two chunks into one.
        
        Args:
            first_chunk_id: ID of the first chunk
            second_chunk_id: ID of the second chunk
            user_id: The ID of the user requesting the combine
            session: Database session
            
        Returns:
            The combined chunk
            
        Raises:
            ChunkNotFoundError: If either chunk is not found
            ChunkCombineError: If chunks cannot be combined
        """
        logger.info(f"Combining chunks: first_chunk_id={first_chunk_id}, second_chunk_id={second_chunk_id} for user_id={user_id}")
        first = self.get_chunk_by_id(first_chunk_id, user_id, session)
        second = self.get_chunk_by_id(second_chunk_id, user_id, session)
        # Validate chunks are from same metatext
        if first.metatext_id != second.metatext_id:
            raise ChunkCombineError(
                first_chunk_id, 
                second_chunk_id, 
                "chunks belong to different metatexts"
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
    
    def update_chunk(self, chunk_id: int, chunk_data: dict, user_id: int, session: Session) -> Chunk:
        """
        Update a chunk with new data.
        
        Args:
            chunk_id: The ID of the chunk to update
            chunk_data: Dictionary of fields to update
            user_id: The ID of the user requesting the update
            session: Database session
            
        Returns:
            The updated chunk
            
        Raises:
            ChunkNotFoundError: If chunk is not found
            ChunkUpdateError: If update fails
        """
        logger.info(f"Updating chunk with id: {chunk_id} for user_id: {user_id}")
        chunk = self.get_chunk_by_id(chunk_id, user_id, session)
        # If setting a bookmark, clear all other bookmarks for this user/metatext first
        if (
            'bookmarked_by_user_id' in chunk_data
            and chunk_data['bookmarked_by_user_id'] is not None
        ):
            # ORM: Clear bookmarks for all other chunks in the same metatext for this user
            other_chunks = session.exec(
                select(Chunk)
                .where(
                    (Chunk.metatext_id == chunk.metatext_id) &
                    (Chunk.bookmarked_by_user_id == user_id) &
                    (Chunk.id != chunk.id)
                )
            ).all()
            for other_chunk in other_chunks:
                other_chunk.bookmarked_by_user_id = None
                session.add(other_chunk)
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
