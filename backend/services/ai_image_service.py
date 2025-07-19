"""AI image service for managing chunk-related AI images."""
from sqlmodel import select, Session, desc
from loguru import logger

from backend.models import Image


class AiImageService:
    """Service for AI image operations related to chunks."""
    
    @staticmethod
    def get_latest_image_for_chunk(session: Session, chunk_id: int) -> Image | None:
        """
        Get the latest AI image for a specific chunk.
        
        Args:
            session: Database session
            chunk_id: The ID of the chunk
            
        Returns:
            Latest Image for the chunk, or None if not found
        """
        logger.debug(f"Getting latest AI image for chunk_id={chunk_id}")
        return session.exec(
            select(Image)
            .where(Image.chunk_id == chunk_id)
            .order_by(desc(Image.id))
        ).first()
    
    @staticmethod
    def get_all_images_for_chunk(session: Session, chunk_id: int) -> list[Image]:
        """
        Get all AI images for a specific chunk, ordered by creation.
        
        Args:
            session: Database session
            chunk_id: The ID of the chunk
            
        Returns:
            List of Image objects for the chunk
        """
        logger.debug(f"Getting all AI images for chunk_id={chunk_id}")
        return list(session.exec(
            select(Image)
            .where(Image.chunk_id == chunk_id)
            .order_by(Image.id)  # type: ignore
        ).all())
    
    @staticmethod
    def get_images_for_chunks(session: Session, chunk_ids: list[int]) -> dict[int, list[Image]]:
        """
        Get all AI images for multiple chunks efficiently.
        
        Args:
            session: Database session
            chunk_ids: List of chunk IDs
            
        Returns:
            Dictionary mapping chunk_id to list of Image objects
        """
        logger.debug(f"Getting AI images for {len(chunk_ids)} chunks")
        
        if not chunk_ids:
            return {}
        
        images = session.exec(
            select(Image)
            .where(Image.chunk_id.in_(chunk_ids))  # type: ignore
            .order_by(Image.chunk_id, Image.id)  # type: ignore
        ).all()
        
        # Group images by chunk_id
        images_by_chunk = {}
        for image in images:
            if image.chunk_id not in images_by_chunk:
                images_by_chunk[image.chunk_id] = []
            images_by_chunk[image.chunk_id].append(image)
        
        # Ensure all chunk_ids have an entry (even if empty)
        for chunk_id in chunk_ids:
            if chunk_id not in images_by_chunk:
                images_by_chunk[chunk_id] = []
        
        return images_by_chunk
