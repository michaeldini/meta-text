from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlmodel import Session

from backend.db import get_session
from backend.models import CreateMetaTextRequest, MetaTextDetail, MetaTextSummary
from backend.services.metatext_service import MetatextService
from backend.exceptions.metatext_exceptions import (
    SourceDocumentNotFoundError,
    MetatextNotFoundError,
    MetatextTitleExistsError,
    MetatextCreationError
)

# Import user dependency from auth
from backend.api.auth import get_current_active_user, UserRead


router = APIRouter()

# Dependency injection function
def get_metatext_service() -> MetatextService:
    """Dependency injection function for MetaTextService."""
    return MetatextService()


@router.post("/metatext", response_model=MetaTextSummary, name="create_metatext")
def create_metatext(
    req: CreateMetaTextRequest,
    current_user: Annotated[UserRead, Depends(get_current_active_user)],
    session: Session = Depends(get_session),
    service: MetatextService = Depends(get_metatext_service)
):
    """Create a new metatext from a source document. Requires authentication."""
    try:
        metatext = service.create_metatext_with_chunks(
            title=req.title,
            source_doc_id=req.sourceDocId,
            user_id=current_user.id,
            session=session
        )
        return metatext
    except SourceDocumentNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source document not found."
        )
    except MetatextTitleExistsError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Meta-text title already exists."
        )
    except MetatextCreationError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/metatext", response_model=list[MetaTextSummary], name="list_metatexts")
def list_metatexts(
    current_user: Annotated[UserRead, Depends(get_current_active_user)],
    session: Session = Depends(get_session),
    service: MetatextService = Depends(get_metatext_service)
):
    """List all metatexts for the authenticated user."""
    return service.list_user_metatexts(user_id=current_user.id, session=session)


@router.get("/metatext/{metatext_id}", response_model=MetaTextDetail, name="get_metatext")
def get_metatext(
    metatext_id: int,
    current_user: Annotated[UserRead, Depends(get_current_active_user)],
    session: Session = Depends(get_session),
    service: MetatextService = Depends(get_metatext_service)
):
    """Get a specific metatext by ID for the authenticated user."""
    try:
        return service.get_metatext_by_id_and_user(metatext_id, current_user.id, session)
    except MetatextNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta-text not found."
        )


@router.delete("/metatext/{metatext_id}", name="delete_metatext")
def delete_metatext(
    metatext_id: int,
    current_user: Annotated[UserRead, Depends(get_current_active_user)],
    session: Session = Depends(get_session),
    service: MetatextService = Depends(get_metatext_service)
) -> dict:
    """Delete a metatext by ID for the authenticated user."""
    try:
        # Only allow deletion if the metatext belongs to the current user
        return service.delete_metatext(metatext_id, current_user.id, session)
    except TypeError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to delete this Meta-text."
        )
    except MetatextNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta-text not found."
        )
