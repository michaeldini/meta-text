"""
Service functions for bookmark management.

UNUSED UNTIL AUTH IS READY
"""
from sqlmodel import Session, select
from ..models import Bookmark, Chunk


def get_user_bookmark_for_metatext(session: Session, user_id: int, meta_text_id: int):
    return session.exec(
        select(Bookmark)
        .where(Bookmark.user_id == user_id, Bookmark.chunk_id == Chunk.id, Chunk.meta_text_id == meta_text_id)
    ).first()


def set_user_bookmark_for_metatext(session: Session, user_id: int, meta_text_id: int, chunk_id: int):
    # Remove any existing bookmark for this user/metatext
    old = session.exec(
        select(Bookmark)
        .where(Bookmark.user_id == user_id, Bookmark.chunk_id == Chunk.id, Chunk.meta_text_id == meta_text_id)
    ).first()
    if old:
        session.delete(old)
    # Add new bookmark
    bookmark = Bookmark(user_id=user_id, chunk_id=chunk_id)
    session.add(bookmark)
    session.commit()
    session.refresh(bookmark)
    return bookmark
