"""Source document service for business logic operations."""
from sqlmodel import select, Session
from loguru import logger

from backend.models import SourceDocument, MetaText
from backend.exceptions.source_document_exceptions import (
    SourceDocumentNotFoundError,
    SourceDocumentTitleExistsError,
    SourceDocumentCreationError,
    SourceDocumentHasDependenciesError,
    SourceDocumentUpdateError
)
from backend.services.text_processing_service import TextProcessingService


class SourceDocumentService:
    """Service for source document business logic operations."""
    
    def __init__(self, text_processing_service: TextProcessingService | None = None):
        self.text_processing_service = text_processing_service or TextProcessingService()
    
    async def create_source_document_from_upload(
        self, 
        title: str, 
        file, 
        session: Session
    ) -> SourceDocument:
        """Create a new source document from an uploaded file."""
        logger.info(f"Creating source document with title: '{title}'")
        
        try:
            # Process the uploaded file
            processed_text = await self.text_processing_service.process_uploaded_file(file)
            
            # Create the source document
            doc = SourceDocument(title=title, text=processed_text)
            session.add(doc)
            session.commit()
            session.refresh(doc)
            
            logger.info(f"Source document created successfully: id={doc.id}, title='{doc.title}'")
            return doc
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error creating source document: {e}")
            
            # Handle specific database constraint errors
            if 'UNIQUE constraint failed' in str(e):
                raise SourceDocumentTitleExistsError(title)
            
            raise SourceDocumentCreationError(f"Failed to create source document: {str(e)}")
    
    def get_source_document_by_id(self, doc_id: int, session: Session) -> SourceDocument:
        """Retrieve a source document by ID."""
        logger.info(f"Retrieving source document with id: {doc_id}")
        doc = session.get(SourceDocument, doc_id)
        
        if not doc:
            logger.warning(f"Source document not found: id={doc_id}")
            raise SourceDocumentNotFoundError(doc_id)
        
        logger.info(f"Source document found: id={doc.id}, title='{doc.title}'")
        return doc
    
    def list_all_source_documents(self, session: Session) -> list[SourceDocument]:
        """List all source documents."""
        logger.info("Listing all source documents")
        docs = list(session.exec(select(SourceDocument)).all())
        logger.info(f"Found {len(docs)} source documents")
        return docs
    
    def delete_source_document(self, doc_id: int, session: Session) -> dict:
        """Delete a source document if no related MetaText records exist."""
        logger.info(f"Attempting to delete source document with id: {doc_id}")
        
        # Check if document exists
        doc = session.get(SourceDocument, doc_id)
        if not doc:
            logger.warning(f"Source document not found for deletion: id={doc_id}")
            raise SourceDocumentNotFoundError(doc_id)
        
        # Check for dependencies
        meta_texts = list(session.exec(select(MetaText).where(MetaText.source_document_id == doc_id)).all())
        if meta_texts:
            logger.warning(f"Cannot delete source document id={doc_id}: {len(meta_texts)} MetaText records exist")
            raise SourceDocumentHasDependenciesError(doc_id, len(meta_texts))
        
        # Perform deletion
        title = doc.title  # Store for response
        session.delete(doc)
        session.commit()
        
        logger.info(f"Source document deleted successfully: id={doc_id}, title='{title}'")
        return {"success": True, "id": doc_id, "title": title}

    def update_source_document(
        self, 
        doc_id: int, 
        update_data: dict, 
        session: Session
    ) -> SourceDocument:
        """Update a source document with provided fields."""
        logger.info(f"Updating source document with id: {doc_id}")
        
        try:
            # Check if document exists
            doc = session.get(SourceDocument, doc_id)
            if not doc:
                logger.warning(f"Source document not found for update: id={doc_id}")
                raise SourceDocumentNotFoundError(doc_id)
            
            # Update only provided fields
            updated_fields = []
            for field, value in update_data.items():
                if value is not None and hasattr(doc, field):
                    setattr(doc, field, value)
                    updated_fields.append(field)
            
            if not updated_fields:
                logger.info(f"No fields to update for source document id={doc_id}")
                return doc
            
            # Handle title uniqueness check if title is being updated
            if 'title' in updated_fields:
                existing_doc = session.exec(
                    select(SourceDocument).where(
                        SourceDocument.title == update_data['title'],
                        SourceDocument.id != doc_id
                    )
                ).first()
                if existing_doc:
                    logger.warning(f"Title already exists: {update_data['title']}")
                    raise SourceDocumentTitleExistsError(update_data['title'])
            
            session.commit()
            session.refresh(doc)
            
            logger.info(f"Source document updated successfully: id={doc.id}, updated_fields={updated_fields}")
            return doc
            
        except (SourceDocumentNotFoundError, SourceDocumentTitleExistsError):
            session.rollback()
            raise
        except Exception as e:
            session.rollback()
            logger.error(f"Error updating source document: {e}")
            raise SourceDocumentUpdateError(f"Failed to update source document: {str(e)}")
