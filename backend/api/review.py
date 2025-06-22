from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import List

from backend.db import get_session
from backend.models import WordDefinition, ChunkRead
from backend.services.review_service import ReviewService
from backend.exceptions.review_exceptions import (
    WordlistNotFoundError,
    ChunksNotFoundError
)


router = APIRouter()

# Initialize service
review_service = ReviewService()


@router.get("/metatext/{metatext_id}/wordlist", response_model=List[WordDefinition], name="get_wordlist")
def get_wordlist(metatext_id: int, session: Session = Depends(get_session)):
    """Get the wordlist for a specific meta-text."""
    try:
        wordlist = review_service.get_wordlist_for_meta_text(metatext_id, session)
        return wordlist if wordlist else []
    except WordlistNotFoundError:
        return []


@router.get("/metatext/{metatext_id}/chunk-summaries-notes", response_model=List[ChunkRead], name="get_chunk_summaries_notes")
def get_chunk_summaries_notes(metatext_id: int, session: Session = Depends(get_session)):
    """Get chunk summaries and notes for a specific meta-text."""
    try:
        chunks = review_service.get_chunk_summaries_and_notes(metatext_id, session)
        return chunks if chunks else []
    except ChunksNotFoundError:
        return []


@router.get("/metatext/{metatext_id}/wordlist-summary", name="get_wordlist_summary")
def get_wordlist_summary(metatext_id: int, session: Session = Depends(get_session)):
    """Get a summary of the wordlist for a specific meta-text."""
    return review_service.get_wordlist_summary(metatext_id, session)


@router.get("/metatext/{metatext_id}/chunks-summary", name="get_chunks_summary")
def get_chunks_summary(metatext_id: int, session: Session = Depends(get_session)):
    """Get a summary of chunks and their completion status for a specific meta-text."""
    return review_service.get_chunks_summary(metatext_id, session)
