"""Meta-text service for business logic operations."""
from sqlmodel import select, Session
from loguru import logger

from backend.models import Metatext, SourceDocument
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
    ) -> Metatext:
        """Create a new metatext with associated chunks from a source document and user."""
        logger.info(f"Creating metatext with title: '{title}' from source_doc_id: {source_doc_id} for user_id: {user_id}")
        
        # Validate source document exists
        doc = self.validate_source_document_exists(source_doc_id, session)
        
        try:
            # Create the metatext
            metatext = Metatext(title=title, source_document_id=doc.id, user_id=user_id, text=doc.text)
            session.add(metatext)
            session.flush()  # Assigns metatext.id without committing

            # Create chunks
            self.chunking_service.create_chunks_for_metatext(
                doc.text, metatext.id, session, chunk_size
            )
            
            # Commit the transaction
            session.commit()
            session.refresh(metatext)

            logger.info(f"Meta-text created successfully: id={metatext.id}, title='{title}'")
            return metatext

        except Exception as e:
            session.rollback()
            logger.error(f"Error creating metatext: {e}")
            
            # Handle specific database constraint errors
            if 'UNIQUE constraint failed' in str(e):
                raise MetatextTitleExistsError(title)
            
            raise MetatextCreationError(f"Failed to create metatext: {str(e)}")

    def get_metatext_by_id_and_user(self, metatext_id: int, user_id: int, session: Session) -> Metatext:
        """Retrieve a metatext by ID for a specific user."""
        logger.info(f"Retrieving metatext with id: {metatext_id} for user_id: {user_id}")
        metatext = session.exec(
            select(Metatext)
            .where(Metatext.id == metatext_id, Metatext.user_id == user_id)
        ).first()
        if not metatext:
            logger.warning(f"Meta-text not found or not owned by user: id={metatext_id}, user_id={user_id}")
            raise MetatextNotFoundError(metatext_id)
        logger.info(f"Meta-text found: id={metatext.id}, title='{metatext.title}', user_id={user_id}")
        return metatext

    def list_user_metatexts(self, user_id: int, session: Session) -> list[Metatext]:
        """List all metatexts for a specific user."""
        logger.info(f"Listing metatexts for user_id={user_id}")
        metatexts = list(session.exec(select(Metatext).where(Metatext.user_id == user_id)).all())
        logger.info(f"Found {len(metatexts)} metatexts for user_id={user_id}")
        return metatexts

    def delete_metatext(self, metatext_id: int, user_id: int, session: Session) -> dict:
        """Delete a metatext by ID for a specific user. Only allows deletion if owned by user."""
        logger.info(f"Attempting to delete metatext with id: {metatext_id} for user_id: {user_id}")
        metatext = session.exec(
            select(Metatext).where(Metatext.id == metatext_id, Metatext.user_id == user_id)
        ).first()
        if not metatext:
            logger.warning(f"Meta-text not found for deletion or not owned by user: id={metatext_id}, user_id={user_id}")
            raise MetatextNotFoundError(metatext_id)
        title = metatext.title  # Store title for response
        session.delete(metatext)
        session.commit()
        logger.info(f"Meta-text deleted successfully: id={metatext_id}, title='{title}', user_id={user_id}")
        return {"success": True, "id": metatext_id, "title": title}
