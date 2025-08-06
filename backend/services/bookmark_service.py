"""
BookmarkService: Service class for managing persistent chunk bookmarks per user/metatext.
"""
from sqlmodel import Session, select
from ..models import Chunk

class BookmarkService:
    def get_user_bookmark_for_metatext(self, session: Session, user_id: int, metatext_id: int):
        """
        Returns the chunk bookmarked by the user for the given metatext, or None.
        """
        chunk = session.exec(
            select(Chunk)
            .where(
                Chunk.metatext_id == metatext_id,
                Chunk.bookmarked_by_user_id == user_id
            )
        ).first()
        return chunk.id if chunk else None

    def set_user_bookmark_for_metatext(self, session: Session, user_id: int, metatext_id: int, chunk_id: int):
        """
        Sets the bookmark for a chunk, ensuring only one chunk is bookmarked per user/metatext.
        """
        # Clear any existing bookmark for this user/metatext
        existing = session.exec(
            select(Chunk)
            .where(
                Chunk.metatext_id == metatext_id,
                Chunk.bookmarked_by_user_id == user_id
            )
        ).all()
        for chunk in existing:
            chunk.bookmarked_by_user_id = None
            session.add(chunk)
        # Set bookmark on the specified chunk
        chunk = session.get(Chunk, chunk_id)
        if not chunk or chunk.metatext_id != metatext_id:
            raise ValueError("Chunk not found or does not belong to the specified metatext.")
        chunk.bookmarked_by_user_id = user_id
        session.add(chunk)
        session.commit()
        session.refresh(chunk)
        return chunk.id

    def clear_user_bookmark_for_metatext(self, session: Session, user_id: int, metatext_id: int):
        """
        Clears the user's bookmark for the given metatext.
        """
        chunk = session.exec(
            select(Chunk)
            .where(
                Chunk.metatext_id == metatext_id,
                Chunk.bookmarked_by_user_id == user_id
            )
        ).first()
        if chunk:
            chunk.bookmarked_by_user_id = None
            session.add(chunk)
            session.commit()
            return True
        else:
            raise ValueError("No bookmark found for the specified user and metatext.")