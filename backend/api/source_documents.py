"""
API router for source document operations.
Handles CRUD operations for source documents including file uploads.
"""

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile, status
from sqlmodel import Session

from backend.models import SourceDocumentSummary, SourceDocumentDetail, SourceDocumentUpdate, DeleteResponse, User
from backend.db import get_session
from backend.services.source_document_service import SourceDocumentService
from backend.dependencies import get_current_user, get_source_document_service
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

router = APIRouter(prefix="/source-documents")

@router.post(
    "",
    response_model=SourceDocumentDetail,
    name="create_source_document"
)
async def create_source_document(
    title: Annotated[str, Form()],
    file: Annotated[UploadFile, File()],
    session: Session = Depends(get_session),
    service: SourceDocumentService = Depends(get_source_document_service),
    user: User = Depends(get_current_user)
):
    """Create a new source document from an uploaded file. Requires authentication."""
    try:
        return await service.create_source_document_from_upload(
            title=title,
            file=file,
            session=session,
            user=user
        )
    except SourceDocumentTitleExistsError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Title already exists."
        )
    except (FileValidationError, InvalidFileExtensionError, FileSizeExceededError) as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except SourceDocumentCreationError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(e)
        )



@router.get("", response_model=list[SourceDocumentSummary], name="list_source_documents")
async def list_source_documents(
    session: Session = Depends(get_session),
    service: SourceDocumentService = Depends(get_source_document_service),
    user: User = Depends(get_current_user)
):
    """List all source documents for the authenticated user."""
    return service.list_all_source_documents(session=session, user=user)



@router.get("/{doc_id}", response_model=SourceDocumentDetail, name="get_source_document")
async def get_source_document(
    doc_id: int,
    session: Session = Depends(get_session),
    service: SourceDocumentService = Depends(get_source_document_service),
    user = Depends(get_current_user)
):
    """Retrieve a source document by ID for the authenticated user."""
    try:
        return service.get_source_document_by_id(doc_id, session, user=user)
    except SourceDocumentNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Source document not found."
        )



@router.delete("/{doc_id}", name="delete_source_document", response_model=DeleteResponse)
async def delete_source_document(
    doc_id: int,
    session: Session = Depends(get_session),
    service: SourceDocumentService = Depends(get_source_document_service),
    user: User = Depends(get_current_user)
) -> DeleteResponse:
    """Delete a source document if no related MetaText records exist. Only for authenticated user."""
    try:
        return service.delete_source_document(doc_id, session, user=user)
    except SourceDocumentNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Source document not found."
        )
    except SourceDocumentHasDependenciesError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Cannot delete: {e.meta_text_count} MetaText records exist for this document."
        )



@router.put("/{doc_id}", response_model=SourceDocumentDetail, name="update_source_document")
async def update_source_document(
    doc_id: int,
    update_data: SourceDocumentUpdate,
    session: Session = Depends(get_session),
    service: SourceDocumentService = Depends(get_source_document_service),
    user: User = Depends(get_current_user)
):
    """Update a source document with provided fields. Only for authenticated user."""
    try:
        # Convert to dict and exclude None values for partial updates
        update_dict = update_data.model_dump(exclude_unset=True, exclude_none=True)
        return service.update_source_document(
            doc_id=doc_id,
            update_data=update_dict,
            session=session,
            user=user
        )
    except SourceDocumentNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Source document not found."
        )
    except SourceDocumentTitleExistsError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Title already exists."
        )
    except SourceDocumentUpdateError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(e)
        )
