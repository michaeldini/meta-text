"""
API router for chunk operations.
Handles CRUD operations for text chunks including splitting and combining operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List

from backend.db import get_session
from backend.models import ChunkRead, ChunkUpdate
from backend.services.chunk_service import ChunkService
from backend.exceptions.chunk_exceptions import (
    ChunkNotFoundError,
    InvalidSplitIndexError,
    ChunkCombineError,
    ChunkUpdateError
)


router = APIRouter()

# Dependency injection function
def get_chunk_service() -> ChunkService:
    """Dependency injection function for ChunkService."""
    return ChunkService()



@router.get("/chunk/{chunk_id}", response_model=ChunkRead, name="get_chunk")
async def get_chunk(
    chunk_id: int, 
    session: Session = Depends(get_session), 
    service: ChunkService = Depends(get_chunk_service)
):
    """Get a specific chunk with its AI images."""
    try:
        return service.get_chunk_with_images(chunk_id, session)
    except ChunkNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Chunk not found"
        )


@router.post("/chunk/{chunk_id}/split", response_model=List[ChunkRead], name="split_chunk")
async def split_chunk(
    chunk_id: int, 
    word_index: int, 
    session: Session = Depends(get_session), 
    service: ChunkService = Depends(get_chunk_service)
):
    """Split a chunk at the specified word index."""
    try:
        return service.split_chunk(chunk_id, word_index, session)
    except ChunkNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Chunk not found"
        )
    except InvalidSplitIndexError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Invalid split index: {e.word_index} (max words: {e.max_words})"
        )


@router.post("/chunk/combine", response_model=ChunkRead, name="combine_chunks")
async def combine_chunks(
    first_chunk_id: int, 
    second_chunk_id: int, 
    session: Session = Depends(get_session), 
    service: ChunkService = Depends(get_chunk_service)
):
    """Combine two chunks into one."""
    try:
        return service.combine_chunks(first_chunk_id, second_chunk_id, session)
    except ChunkNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Chunk not found: {e.chunk_id}"
        )
    except ChunkCombineError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )


@router.put("/chunk/{chunk_id}", response_model=ChunkRead, name="update_chunk")
async def update_chunk(
    chunk_id: int, 
    update_data: ChunkUpdate, 
    session: Session = Depends(get_session), 
    service: ChunkService = Depends(get_chunk_service)
):
    """Update a chunk with new data."""
    try:
        # Convert to dict and exclude None values for partial updates
        update_dict = update_data.model_dump(exclude_unset=True, exclude_none=True)
        
        return service.update_chunk(chunk_id, update_dict, session)
    except ChunkNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Chunk not found"
        )
    except ChunkUpdateError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Update failed: {e.reason}"
        )

