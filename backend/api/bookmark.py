# file in progress. finish when auth is ready

# backend/api/bookmarks.py
# from fastapi import APIRouter, Depends
# from sqlmodel import Session, select
# from .dependencies import get_current_user, get_session

# from ..models import User
# from ..services.bookmark_service import (
#     get_user_bookmark_for_metatext,
#     set_user_bookmark_for_metatext,
# )

# router = APIRouter()

# @router.get("/bookmarks/{meta_text_id}")
# def get_bookmark(meta_text_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
#     bookmark = get_user_bookmark_for_metatext(session, user.id, meta_text_id)
#     return bookmark

# @router.post("/bookmarks/")
# def set_bookmark(meta_text_id: int, chunk_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
#     bookmark = set_user_bookmark_for_metatext(session, user.id, meta_text_id, chunk_id)
#     return bookmark