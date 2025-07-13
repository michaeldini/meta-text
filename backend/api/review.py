"""Review API endpoints for managing wordlists, chunks, and phrase explanations."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List

from backend.db import get_session
from backend.models import WordDefinition, PhraseExplanation
from backend.services.review_service import ReviewService
from backend.exceptions.review_exceptions import (
    WordlistNotFoundError
)


router = APIRouter()

# Dependency injection function
def get_review_service() -> ReviewService:
    """Dependency injection function for ReviewService."""
    return ReviewService()


@router.get("/metatext/{metatext_id}/wordlist", response_model=List[WordDefinition], name="get_wordlist")
def get_wordlist(
    metatext_id: int, 
    session: Session = Depends(get_session),
    service: ReviewService = Depends(get_review_service)
):
    """Get the wordlist for a specific metatext."""
    try:
        return service.get_wordlist_for_meta_text(metatext_id, session)
    except WordlistNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wordlist not found for the specified metatext."
        )




@router.get("/metatext/{metatext_id}/explanations", response_model=List[PhraseExplanation], name="get_phrase_explanations")
def get_explanations(
    metatext_id: int, 
    session: Session = Depends(get_session),
    service: ReviewService = Depends(get_review_service)
):
    """Get all phrase explanations for a specific metatext."""
    return service.get_phrase_explanations(metatext_id, session)


# @router.get("/metatext/{metatext_id}/chunk-summaries-notes", response_model=List[ChunkRead], name="get_chunk_summaries_notes")
# def get_chunk_summaries_notes(
#     metatext_id: int, 
#     session: Session = Depends(get_session),
#     service: ReviewService = Depends(get_review_service)
# ):
#     """Get chunk summaries and notes for a specific metatext."""
#     try:
#         return service.get_chunk_summaries_and_notes(metatext_id, session)
#     except ChunksNotFoundError:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Chunks not found for the specified metatext."
#         )


# @router.get("/metatext/{metatext_id}/wordlist-summary", name="get_wordlist_summary")
# def get_wordlist_summary(
#     metatext_id: int, 
#     session: Session = Depends(get_session),
#     service: ReviewService = Depends(get_review_service)
# ):
#     """Get a summary of the wordlist for a specific metatext."""
#     return service.get_wordlist_summary(metatext_id, session)


# @router.get("/metatext/{metatext_id}/chunks-summary", name="get_chunks_summary")
# def get_chunks_summary(
#     metatext_id: int, 
#     session: Session = Depends(get_session),
#     service: ReviewService = Depends(get_review_service)
# ):
#     """Get a summary of chunks and their completion status for a specific metatext."""
#     return service.get_chunks_summary(metatext_id, session)
