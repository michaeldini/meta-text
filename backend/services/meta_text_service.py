"""Meta-text service for business logic operations."""
from sqlmodel import select, Session
from loguru import logger

from backend.models import MetaText, SourceDocument, Chunk
from backend.exceptions.meta_text_exceptions import (
    SourceDocumentNotFoundError,
    MetaTextNotFoundError,
    MetaTextTitleExistsError,
    MetaTextCreationError
)
from backend.services.text_chunking_service import TextChunkingService
from backend.config import DEFAULT_CHUNK_SIZE


class MetaTextService:
    """Service for meta-text business logic operations."""
    
    def __init__(self, chunking_service: TextChunkingService | None = None):
        self.chunking_service = chunking_service or TextChunkingService()
    
    def validate_source_document_exists(self, source_doc_id: int, session: Session) -> SourceDocument:
        """Validate that a source document exists and return it."""
        doc = session.exec(select(SourceDocument).where(SourceDocument.id == source_doc_id)).first()
        if not doc:
            logger.warning(f"Source document not found: id={source_doc_id}")
            raise SourceDocumentNotFoundError(source_doc_id)
        return doc
    
    def create_meta_text_with_chunks(
        self, 
        title: str, 
        source_doc_id: int, 
        session: Session,
        chunk_size: int = DEFAULT_CHUNK_SIZE
    ) -> MetaText:
        """Create a new meta-text with associated chunks from a source document."""
        logger.info(f"Creating meta-text with title: '{title}' from source_doc_id: {source_doc_id}")
        
        # Validate source document exists
        doc = self.validate_source_document_exists(source_doc_id, session)
        
        try:
            # Create the meta-text
            meta_text = MetaText(title=title, source_document_id=doc.id, text=doc.text)
            session.add(meta_text)
            session.flush()  # Assigns meta_text.id without committing
            
            # Create chunks
            self.chunking_service.create_chunks_for_meta_text(
                doc.text, meta_text.id, session, chunk_size
            )
            
            # Commit the transaction
            session.commit()
            session.refresh(meta_text)
            
            logger.info(f"Meta-text created successfully: id={meta_text.id}, title='{title}'")
            return meta_text
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error creating meta-text: {e}")
            
            # Handle specific database constraint errors
            if 'UNIQUE constraint failed' in str(e):
                raise MetaTextTitleExistsError(title)
            
            raise MetaTextCreationError(f"Failed to create meta-text: {str(e)}")
    
    def get_meta_text_by_id(self, meta_text_id: int, session: Session) -> MetaText:
        """Retrieve a meta-text by ID."""
        logger.info(f"Retrieving meta-text with id: {meta_text_id}")
        meta_text = session.exec(
            select(MetaText)
            .where(MetaText.id == meta_text_id)
        ).first()
        
        
        if not meta_text:
            logger.warning(f"Meta-text not found: id={meta_text_id}")
            raise MetaTextNotFoundError(meta_text_id)
        
        # Sort related chunks by position (ascending)
        if hasattr(meta_text, "chunks") and meta_text.chunks:
            meta_text.chunks.sort(key=lambda c: c.position)
        
        logger.info(f"Meta-text found: id={meta_text.id}, title='{meta_text.title}'")
        return meta_text
    
    def list_all_meta_texts(self, session: Session) -> list[MetaText]:
        """List all meta-texts."""
        logger.info("Listing all meta-texts")
        meta_texts = list(session.exec(select(MetaText)).all())
        logger.info(f"Found {len(meta_texts)} meta-texts")
        return meta_texts
    
    def delete_meta_text(self, meta_text_id: int, session: Session) -> dict:
        """Delete a meta-text by ID."""
        logger.info(f"Attempting to delete meta-text with id: {meta_text_id}")
        meta_text = session.get(MetaText, meta_text_id)
        
        if not meta_text:
            logger.warning(f"Meta-text not found for deletion: id={meta_text_id}")
            raise MetaTextNotFoundError(meta_text_id)
        
        title = meta_text.title  # Store title for response
        session.delete(meta_text)
        session.commit()
        
        logger.info(f"Meta-text deleted successfully: id={meta_text_id}, title='{title}'")
        return {"success": True, "id": meta_text_id, "title": title}
