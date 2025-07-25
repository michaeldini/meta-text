"""Source document service for business logic operations."""
import os
from sqlmodel import select, Session
from loguru import logger

from backend.config import BackendConfig as CONFIG
from backend.models import SourceDocument, Metatext, DeleteResponse
from backend.exceptions.source_document_exceptions import (
    SourceDocumentNotFoundError,
    SourceDocumentTitleExistsError,
    SourceDocumentCreationError,
    SourceDocumentHasDependenciesError,
    SourceDocumentUpdateError,
    FileValidationError,
    InvalidFileExtensionError,
    FileSizeExceededError
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
        session: Session,
        user
    ) -> SourceDocument:
        """Create a new source document from an uploaded file. Tries to extract and set author if present. Associates document with user."""
        logger.info(f"Creating source document with title: '{title}' for user_id={user.id}")

        try:
            # Validate the uploaded file
            self._validate_upload_file(file)

            # Process the uploaded file and extract text and author
            processed = await self.text_processing_service.process_uploaded_file(file)
            processed_text = processed["text"]
            author = processed["author"]

            # Create the source document, including author if found
            doc_kwargs = dict(title=title, text=processed_text, user_id=user.id)
            if author:
                doc_kwargs['author'] = author
                logger.info(f"Extracted author: '{author}'")
            doc = SourceDocument(**doc_kwargs) # type: ignore
            session.add(doc)
            session.commit()
            session.refresh(doc)

            logger.info(f"Source document created successfully: id={doc.id}, title='{doc.title}', user_id={user.id}")
            return doc

        except Exception as e:
            session.rollback()
            logger.error(f"Error creating source document: {e}")

            # Handle specific database constraint errors
            if 'UNIQUE constraint failed' in str(e):
                raise SourceDocumentTitleExistsError(title)

            raise SourceDocumentCreationError(f"Failed to create source document: {str(e)}")
    
    def get_source_document_by_id(self, doc_id: int, session: Session, user) -> SourceDocument:
        """Retrieve a source document by ID for the given user."""
        doc = session.exec(
            select(SourceDocument).where(SourceDocument.id == doc_id, SourceDocument.user_id == user.id)
        ).first()
        if not doc:
            logger.warning(f"Source document not found or not owned by user: id={doc_id}, user_id={user.id}")
            raise SourceDocumentNotFoundError(doc_id)
        return doc
    
    def list_all_source_documents(self, session: Session, user) -> list[SourceDocument]:
        """List all source documents for the given user."""
        docs = list(session.exec(select(SourceDocument).where(SourceDocument.user_id == user.id)).all())
        return docs

    def delete_source_document(self, doc_id: int, session: Session, user) -> DeleteResponse:
        """Delete a source document if no related MetaText records exist. Only if owned by user."""
        # Check if document exists and is owned by user
        doc = session.exec(
            select(SourceDocument).where(SourceDocument.id == doc_id, SourceDocument.user_id == user.id)
        ).first()
        if not doc:
            logger.warning(f"Source document not found for deletion or not owned by user: id={doc_id}, user_id={user.id}")
            raise SourceDocumentNotFoundError(doc_id)
        # Check for dependencies
        meta_texts = list(session.exec(select(Metatext).where(Metatext.source_document_id == doc_id)).all())
        if meta_texts:
            logger.warning(f"Cannot delete source document id={doc_id}: {len(meta_texts)} Metatext records exist")
            raise SourceDocumentHasDependenciesError(doc_id, len(meta_texts))
        # Perform deletion
        title = doc.title  # Store for response
        session.delete(doc)
        session.commit()
        return DeleteResponse(
            message=f"Source document deleted successfully: title='{title}'",
            deleted_id=doc_id
        )

    def update_source_document(
        self,
        doc_id: int,
        update_data: dict,
        session: Session,
        user
    ) -> SourceDocument:
        """Update a source document with provided fields. Only if owned by user."""
        try:
            # Check if document exists and is owned by user
            doc = session.exec(
                select(SourceDocument).where(SourceDocument.id == doc_id, SourceDocument.user_id == user.id)
            ).first()
            if not doc:
                logger.warning(f"Source document not found for update or not owned by user: id={doc_id}, user_id={user.id}")
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
                        SourceDocument.id != doc_id,
                        SourceDocument.user_id == user.id
                    )
                ).first()
                if existing_doc:
                    logger.warning(f"Title already exists for user: {update_data['title']}")
                    raise SourceDocumentTitleExistsError(update_data['title'])
            session.commit()
            session.refresh(doc)
            return doc
        except (SourceDocumentNotFoundError, SourceDocumentTitleExistsError):
            session.rollback()
            raise
        except Exception as e:
            session.rollback()
            logger.error(f"Error updating source document: {e}")
            raise SourceDocumentUpdateError(f"Failed to update source document: {str(e)}")
    
    def _validate_upload_file(self, file) -> None:
        """Validate uploaded file type and size."""
        # Validate filename exists
        if not file.filename:
            raise FileValidationError("Filename is required")
        
        # Validate file extension
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in CONFIG.ALLOWED_EXTENSIONS:
            raise InvalidFileExtensionError(
                f"File extension {file_extension} not allowed. Allowed: {', '.join(CONFIG.ALLOWED_EXTENSIONS)}"
            )
        
        # Validate file size
        if file.size and file.size > CONFIG.MAX_FILE_SIZE:
            raise FileSizeExceededError(
                f"File size {file.size} bytes exceeds maximum allowed size of {CONFIG.MAX_FILE_SIZE} bytes"
            )
