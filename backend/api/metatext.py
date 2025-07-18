from fastapi import APIRouter, Depends, HTTPException, status
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


# Import new user dependency from services.auth_dependencies
from backend.services.auth_dependencies import get_current_user


router = APIRouter()

# Dependency injection function
def get_metatext_service() -> MetatextService:
    """Dependency injection function for MetaTextService."""
    return MetatextService()


@router.post("/metatext", response_model=MetaTextSummary, name="create_metatext")
def create_metatext(
    req: CreateMetaTextRequest,
    session: Session = Depends(get_session),
    service: MetatextService = Depends(get_metatext_service),
    user = Depends(get_current_user)
):
    """
    Create a new metatext from a source document. Requires authentication.
    Refactored to use new auth pattern: user context is injected as 'user'.
    """
    try:
        # Pass user context explicitly to the service
        metatext = service.create_metatext_with_chunks(
            title=req.title,
            source_doc_id=req.sourceDocId,
            user_id=user.id,
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
    session: Session = Depends(get_session),
    service: MetatextService = Depends(get_metatext_service),
    user = Depends(get_current_user)
):
    """List all metatexts for the authenticated user. Refactored to use 'user' variable."""
    return service.list_user_metatexts(user_id=user.id, session=session)


@router.get("/metatext/{metatext_id}", response_model=MetaTextDetail, name="get_metatext")
def get_metatext(
    metatext_id: int,
    session: Session = Depends(get_session),
    service: MetatextService = Depends(get_metatext_service),
    user = Depends(get_current_user)
):
    """Get a specific metatext by ID for the authenticated user. Refactored to use 'user' variable."""
    try:
        return service.get_metatext_by_id_and_user(metatext_id, user.id, session)
    except MetatextNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta-text not found."
        )


@router.delete("/metatext/{metatext_id}", name="delete_metatext")
def delete_metatext(
    metatext_id: int,
    session: Session = Depends(get_session),
    service: MetatextService = Depends(get_metatext_service),
    user = Depends(get_current_user)
) -> dict:
    """Delete a metatext by ID for the authenticated user. Refactored to use 'user' variable."""
    try:
        # Only allow deletion if the metatext belongs to the current user
        return service.delete_metatext(metatext_id, user.id, session)
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
