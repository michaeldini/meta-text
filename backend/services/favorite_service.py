"""
Service layer for managing favorite chunks for users.
"""
from sqlmodel import select, Session
from fastapi import HTTPException
from backend.models import Chunk
from loguru import logger

class FavoriteService:
    @staticmethod
    def favorite_chunk(chunk_id: int, user_id: int, session: Session) -> Chunk:
        """
        Mark a chunk as favorite for the user.
        """
        chunk = session.get(Chunk, chunk_id)
        if not chunk:
            logger.warning(f"Chunk not found: id={chunk_id}")
            raise HTTPException(status_code=404, detail="Chunk not found")
        chunk.favorited_by_user_id = user_id
        session.add(chunk)
        session.commit()
        session.refresh(chunk)
        logger.info(f"Chunk {chunk_id} favorited by user {user_id}")
        return chunk

    @staticmethod
    def unfavorite_chunk(chunk_id: int, user_id: int, session: Session) -> Chunk:
        """
        Remove a chunk from user's favorites.
        """
        chunk = session.get(Chunk, chunk_id)
        if not chunk:
            logger.warning(f"Chunk not found: id={chunk_id}")
            raise HTTPException(status_code=404, detail="Chunk not found")
        if chunk.favorited_by_user_id != user_id:
            logger.warning(f"User {user_id} tried to unfavorite chunk {chunk_id} not favorited by them")
            raise HTTPException(status_code=403, detail="Not authorized to unfavorite this chunk")
        chunk.favorited_by_user_id = None
        session.add(chunk)
        session.commit()
        session.refresh(chunk)
        logger.info(f"Chunk {chunk_id} unfavorited by user {user_id}")
        return chunk

    @staticmethod
    def get_favorite_chunks(user_id: int, session: Session) -> list[Chunk]:
        """
        Get all favorite chunks for a user.
        """
        statement = select(Chunk).where(Chunk.favorited_by_user_id == user_id)
        results = session.exec(statement).all()
        logger.info(f"User {user_id} has {len(results)} favorite chunks")
        return list(results)
