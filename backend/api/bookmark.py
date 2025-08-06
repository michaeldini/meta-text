
# API endpoints for managing bookmarks (persistent chunk bookmarks per user/metatext)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from backend.db import get_session
from backend.api.auth import UserRead
from backend.services.bookmark_service import BookmarkService
from pydantic import BaseModel
from backend.dependencies import get_current_user, get_bookmark_service

router = APIRouter()

# Pydantic model for setting a bookmark
class SetBookmarkRequest(BaseModel):
    metatext_id: int
    chunk_id: int

@router.get("/bookmarks/{metatext_id}")
def get_bookmark(
    metatext_id: int,
    session: Session = Depends(get_session),
    service: BookmarkService = Depends(get_bookmark_service),
    user: UserRead = Depends(get_current_user)
):
    """Get the user's bookmarked chunk id for a given metatext."""
    try:
        chunk_id = service.get_user_bookmark_for_metatext(session, user.id, metatext_id)
        return {"chunk_id": chunk_id}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/bookmarks/", status_code=status.HTTP_201_CREATED)
def set_bookmark(
    request: SetBookmarkRequest,
    session: Session = Depends(get_session),
    service: BookmarkService = Depends(get_bookmark_service),
    user: UserRead = Depends(get_current_user)
):
    """Set the user's bookmark for a given metatext and chunk."""
    try:
        chunk_id = service.set_user_bookmark_for_metatext(
            session, user.id, request.metatext_id, request.chunk_id
        )
        return {"chunk_id": chunk_id}
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

