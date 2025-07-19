
# API endpoints for managing bookmarks (persistent chunk bookmarks per user/metatext)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from backend.db import get_session
from backend.api.auth import UserRead
from backend.services.bookmark_service import BookmarkService
from backend.models import SetBookmarkRequest
from backend.services.auth_dependencies import get_current_user


router = APIRouter()

# Dependency injection function for BookmarkService
def get_bookmark_service() -> BookmarkService:
    return BookmarkService()

@router.get("/bookmarks/{metatext_id}")
def get_bookmark(
    metatext_id: int,
    session: Session = Depends(get_session),
    service: BookmarkService = Depends(get_bookmark_service),
    user: UserRead = Depends(get_current_user)
):
    """Get the user's bookmark for a given metatext."""
    try:
        return service.get_user_bookmark_for_metatext(session, user.id, metatext_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/bookmarks/", status_code=status.HTTP_201_CREATED)
def set_bookmark(
    req: SetBookmarkRequest,
    session: Session = Depends(get_session),
    service: BookmarkService = Depends(get_bookmark_service),
    user: UserRead = Depends(get_current_user)
):
    """Set the user's bookmark for a given metatext and chunk."""
    try:
        return service.set_user_bookmark_for_metatext(session, user.id, req.metatext_id, req.chunk_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/bookmarks/{metatext_id}", status_code=status.HTTP_204_NO_CONTENT)
def clear_bookmark(
    metatext_id: int,
    session: Session = Depends(get_session),
    service: BookmarkService = Depends(get_bookmark_service),
    user: UserRead = Depends(get_current_user)
):
    """Delete the user's bookmark for a given metatext."""
    try:
        service.clear_user_bookmark_for_metatext(session, user.id, metatext_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

