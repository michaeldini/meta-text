from fastapi import APIRouter, Depends, HTTPException, Body, status
from sqlmodel import Session
from typing import List

from backend.db import get_session
from backend.models import ChunkRead, ChunkWithImagesRead
from backend.services.chunk_service import ChunkService
from backend.exceptions.chunk_exceptions import (
    ChunkNotFoundError,
    InvalidSplitIndexError,
    ChunkCombineError,
    ChunkUpdateError,
    NoChunksFoundError
)


router = APIRouter()

# Initialize service
chunk_service = ChunkService()


@router.get("/chunks/all/{meta_text_id}", response_model=List[ChunkWithImagesRead], name="get_chunks")
def get_chunks_api(meta_text_id: int, session: Session = Depends(get_session)):
    """Get all chunks for a meta-text with their AI images."""
    try:
        return chunk_service.get_all_chunks_for_meta_text(meta_text_id, session)
    except NoChunksFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"No chunks found for meta_text_id: {meta_text_id}"
        )


@router.get("/chunk/{chunk_id}", response_model=ChunkWithImagesRead, name="get_chunk")
def get_chunk(chunk_id: int, session: Session = Depends(get_session)):
    """Get a specific chunk with its AI images."""
    try:
        return chunk_service.get_chunk_with_images(chunk_id, session)
    except ChunkNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Chunk not found"
        )


@router.post("/chunk/{chunk_id}/split", response_model=List[ChunkRead], name="split_chunk")
def split_chunk(chunk_id: int, word_index: int, session: Session = Depends(get_session)):
    """Split a chunk at the specified word index."""
    try:
        return chunk_service.split_chunk(chunk_id, word_index, session)
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
def combine_chunks(first_chunk_id: int, second_chunk_id: int, session: Session = Depends(get_session)):
    """Combine two chunks into one."""
    try:
        return chunk_service.combine_chunks(first_chunk_id, second_chunk_id, session)
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
def update_chunk(chunk_id: int, chunk_data: dict = Body(...), session: Session = Depends(get_session)):
    """Update a chunk with new data."""
    try:
        return chunk_service.update_chunk(chunk_id, chunk_data, session)
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
