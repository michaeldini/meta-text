"""
API router for favorite chunk operations.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from backend.db import get_session
from backend.models import ChunkRead
from backend.services.favorite_service import FavoriteService
from backend.dependencies import get_current_user

router = APIRouter()

@router.post("/chunk/{chunk_id}/favorite", response_model=ChunkRead, name="favorite_chunk")
async def favorite_chunk(
    chunk_id: int,
    session: Session = Depends(get_session),
    user = Depends(get_current_user)
):
    """Mark a chunk as favorite for the current user."""
    chunk = FavoriteService.favorite_chunk(chunk_id, user.id, session)
    return ChunkRead.model_validate(chunk, from_attributes=True)

@router.delete("/chunk/{chunk_id}/favorite", response_model=ChunkRead, name="unfavorite_chunk")
async def unfavorite_chunk(
    chunk_id: int,
    session: Session = Depends(get_session),
    user = Depends(get_current_user)
):
    """Remove a chunk from the current user's favorites."""
    chunk = FavoriteService.unfavorite_chunk(chunk_id, user.id, session)
    return ChunkRead.model_validate(chunk, from_attributes=True)

@router.get("/user/me/favorite_chunks", response_model=List[ChunkRead], name="get_favorite_chunks")
async def get_favorite_chunks(
    session: Session = Depends(get_session),
    user = Depends(get_current_user)
):
    """Get all favorite chunks for the current user."""
    chunks = FavoriteService.get_favorite_chunks(user.id, session)
    return [ChunkRead.model_validate(chunk, from_attributes=True) for chunk in chunks]
