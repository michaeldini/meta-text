"""Meta-text service for business logic operations."""
from sqlmodel import select, Session
from loguru import logger

from backend.models import MetaText, SourceDocument
from backend.exceptions.metatext_exceptions import (
    SourceDocumentNotFoundError,
    MetatextNotFoundError,
    MetatextTitleExistsError,
    MetatextCreationError
)
from backend.services.text_chunking_service import TextChunkingService
from backend.config import BackendConfig as CONFIG


class MetatextService:
    """Service for metatext business logic operations."""
    
    def __init__(self, chunking_service: TextChunkingService | None = None):
        self.chunking_service = chunking_service or TextChunkingService()
    
    def validate_source_document_exists(self, source_doc_id: int, session: Session) -> SourceDocument:
        """Validate that a source document exists and return it."""
        doc = session.exec(select(SourceDocument).where(SourceDocument.id == source_doc_id)).first()
        if not doc:
            logger.warning(f"Source document not found: id={source_doc_id}")
            raise SourceDocumentNotFoundError(source_doc_id)
        return doc
    
    def create_metatext_with_chunks(
        self, 
        title: str, 
        source_doc_id: int, 
        user_id: int,
        session: Session,   
        chunk_size: int = CONFIG.DEFAULT_CHUNK_SIZE
    ) -> MetaText:
        """Create a new metatext with associated chunks from a source document and user."""
        logger.info(f"Creating metatext with title: '{title}' from source_doc_id: {source_doc_id} for user_id: {user_id}")
        
        # Validate source document exists
        doc = self.validate_source_document_exists(source_doc_id, session)
        
        try:
            # Create the metatext
            meta_text = MetaText(title=title, source_document_id=doc.id, user_id=user_id, text=doc.text)
            session.add(meta_text)
            session.flush()  # Assigns meta_text.id without committing
            
            # Create chunks
            self.chunking_service.create_chunks_for_metatext(
                doc.text, meta_text.id, session, chunk_size
            )
            
            # Commit the transaction
            session.commit()
            session.refresh(meta_text)
            
            logger.info(f"Meta-text created successfully: id={meta_text.id}, title='{title}'")
            return meta_text
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error creating metatext: {e}")
            
            # Handle specific database constraint errors
            if 'UNIQUE constraint failed' in str(e):
                raise MetatextTitleExistsError(title)
            
            raise MetatextCreationError(f"Failed to create metatext: {str(e)}")
    
    def get_metatext_by_id_and_user(self, meta_text_id: int, user_id: int, session: Session) -> MetaText:
        """Retrieve a metatext by ID for a specific user."""
        logger.info(f"Retrieving metatext with id: {meta_text_id} for user_id: {user_id}")
        meta_text = session.exec(
            select(MetaText)
            .where(MetaText.id == meta_text_id, MetaText.user_id == user_id)
        ).first()
        if not meta_text:
            logger.warning(f"Meta-text not found or not owned by user: id={meta_text_id}, user_id={user_id}")
            raise MetatextNotFoundError(meta_text_id)
        logger.info(f"Meta-text found: id={meta_text.id}, title='{meta_text.title}', user_id={user_id}")
        return meta_text
    
    def list_user_metatexts(self, user_id: int, session: Session) -> list[MetaText]:
        """List all metatexts for a specific user."""
        logger.info(f"Listing metatexts for user_id={user_id}")
        meta_texts = list(session.exec(select(MetaText).where(MetaText.user_id == user_id)).all())
        logger.info(f"Found {len(meta_texts)} metatexts for user_id={user_id}")
        return meta_texts
    
    def delete_metatext(self, meta_text_id: int, session: Session) -> dict:
        """Delete a metatext by ID."""
        logger.info(f"Attempting to delete metatext with id: {meta_text_id}")
        meta_text = session.get(MetaText, meta_text_id)
        
        if not meta_text:
            logger.warning(f"Meta-text not found for deletion: id={meta_text_id}")
            raise MetatextNotFoundError(meta_text_id)
        
        title = meta_text.title  # Store title for response
        session.delete(meta_text)
        session.commit()
        
        logger.info(f"Meta-text deleted successfully: id={meta_text_id}, title='{title}'")
        return {"success": True, "id": meta_text_id, "title": title}
