"""Text chunking service for processing documents."""
from sqlmodel import Session
from loguru import logger

from backend.models import Chunk
from backend.config import BackendConfig as CONFIG




class TextChunkingService:
    """Service for handling text chunking operations."""
    
    @staticmethod
    def split_text_into_chunks(text: str, chunk_size: int = CONFIG.DEFAULT_CHUNK_SIZE) -> list[str]:
        """Split text into a list of chunk_size-word strings."""
        words = text.split()
        return [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
    
    @staticmethod
    def create_chunks_for_metatext(
        text: str, 
        metatext_id: int, 
        session: Session, 
        chunk_size: int = CONFIG.DEFAULT_CHUNK_SIZE
    ) -> list[Chunk]:
        """Create and persist chunks for a metatext."""
        chunk_texts = TextChunkingService.split_text_into_chunks(text, chunk_size)
        logger.info(f"Creating {len(chunk_texts)} chunks of size {chunk_size} for meta_text_id={metatext_id}")
        
        chunks = []
        for i, chunk_text in enumerate(chunk_texts):
            chunk = Chunk(
                text=chunk_text,
                position=float(i),
                metatext_id=metatext_id
            )
            session.add(chunk)
            chunks.append(chunk)
        
        return chunks
