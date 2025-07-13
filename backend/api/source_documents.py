"""
API router for source document operations.
Handles CRUD operations for source documents including file uploads.
"""

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile, status
from sqlmodel import Session

from backend.models import SourceDocumentSummary, SourceDocumentDetail, SourceDocumentUpdate, DeleteResponse
from backend.db import get_session
from backend.services.source_document_service import SourceDocumentService
from backend.exceptions.source_document_exceptions import (
    SourceDocumentNotFoundError,
    SourceDocumentTitleExistsError,
    SourceDocumentCreationError,
    SourceDocumentHasDependenciesError,
    SourceDocumentUpdateError
)


router = APIRouter()

# Initialize service
source_document_service = SourceDocumentService()


@router.post(
    "/source-documents",
    response_model=SourceDocumentDetail,
    name="create_source_document"
)
async def create_source_document(
    title: Annotated[str, Form()],
    file: Annotated[UploadFile, File()],
    session: Session = Depends(get_session),
):
    """Create a new source document from an uploaded file."""
    try:
        return await source_document_service.create_source_document_from_upload(
            title=title,
            file=file,
            session=session
        )
    except SourceDocumentTitleExistsError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Title already exists."
        )
    except SourceDocumentCreationError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(e)
        )


@router.get("/source-documents", response_model=list[SourceDocumentSummary], name="list_source_documents")
async def list_source_documents(session: Session = Depends(get_session)):
    """List all source documents with all fields."""
    return source_document_service.list_all_source_documents(session)


@router.get("/source-documents/{doc_id}", response_model=SourceDocumentDetail, name="get_source_document")
async def get_source_document(doc_id: int, session: Session = Depends(get_session)):
    """Retrieve a source document by ID."""
    try:
        return source_document_service.get_source_document_by_id(doc_id, session)
    except SourceDocumentNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Source document not found."
        )


@router.delete("/source-documents/{doc_id}", name="delete_source_document", response_model=DeleteResponse)
async def delete_source_document(doc_id: int, session: Session = Depends(get_session)) -> DeleteResponse:
    """Delete a source document if no related MetaText records exist."""
    try:
        return source_document_service.delete_source_document(doc_id, session)
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


@router.put("/source-documents/{doc_id}", response_model=SourceDocumentDetail, name="update_source_document")
async def update_source_document(
    doc_id: int, 
    update_data: SourceDocumentUpdate,
    session: Session = Depends(get_session)
):
    """Update a source document with provided fields."""
    try:
        # Convert to dict and exclude None values for partial updates
        update_dict = update_data.model_dump(exclude_unset=True, exclude_none=True)
        
        return source_document_service.update_source_document(
            doc_id=doc_id,
            update_data=update_dict,
            session=session
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
