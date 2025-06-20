from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from backend.db import get_session
from backend.models import CreateMetaTextRequest, MetaTextRead
from backend.services.meta_text_service import MetaTextService
from backend.exceptions.meta_text_exceptions import (
    SourceDocumentNotFoundError,
    MetaTextNotFoundError,
    MetaTextTitleExistsError,
    MetaTextCreationError
)


router = APIRouter()

# Initialize service
meta_text_service = MetaTextService()


@router.post("/meta-text", response_model=MetaTextRead, name="create_meta_text")
async def create_meta_text(req: CreateMetaTextRequest, session: Session = Depends(get_session)):
    """Create a new meta-text from a source document."""
    try:
        meta_text = meta_text_service.create_meta_text_with_chunks(
            title=req.title,
            source_doc_id=req.sourceDocId,
            session=session
        )
        return meta_text
    except SourceDocumentNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Source document not found."
        )
    except MetaTextTitleExistsError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Meta-text title already exists."
        )
    except MetaTextCreationError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(e)
        )


@router.get("/meta-text", response_model=list[MetaTextRead], name="list_meta_texts")
def list_meta_texts(session: Session = Depends(get_session)):
    """List all meta-texts."""
    return meta_text_service.list_all_meta_texts(session)


@router.get("/meta-text/{meta_text_id}", response_model=MetaTextRead, name="get_meta_text")
def get_meta_text(meta_text_id: int, session: Session = Depends(get_session)):
    """Get a specific meta-text by ID."""
    try:
        return meta_text_service.get_meta_text_by_id(meta_text_id, session)
    except MetaTextNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Meta-text not found."
        )


@router.delete("/meta-text/{meta_text_id}", name="delete_meta_text")
def delete_meta_text(meta_text_id: int, session: Session = Depends(get_session)) -> dict:
    """Delete a meta-text by ID."""
    try:
        return meta_text_service.delete_meta_text(meta_text_id, session)
    except MetaTextNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Meta-text not found."
        )
