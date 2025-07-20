"""Review API endpoints for managing wordlists, chunks, and phrase explanations."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List

from backend.db import get_session
from backend.models import Explanation, ReviewResponse
from backend.services.auth_dependencies import get_current_user
from backend.services.review_service import ReviewService
from backend.exceptions.review_exceptions import (
    WordlistNotFoundError
)


router = APIRouter()

# Dependency injection function
def get_review_service() -> ReviewService:
    """Dependency injection function for ReviewService."""
    return ReviewService()


@router.get("/metatext/{metatext_id}/wordlist", response_model=List[Explanation], name="get_wordlist")
def get_wordlist(
    metatext_id: int, 
    session: Session = Depends(get_session),
    service: ReviewService = Depends(get_review_service),
    user = Depends(get_current_user)
):
    """Get the wordlist for a specific metatext and user."""
    try:
        return service.get_wordlist_for_meta_text(metatext_id, user.id, session)
    except WordlistNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wordlist not found for the specified metatext."
        )




@router.get("/metatext/{metatext_id}/explanations", response_model=ReviewResponse, name="get_phrase_explanations")
def get_explanations(
    metatext_id: int, 
    session: Session = Depends(get_session),
    service: ReviewService = Depends(get_review_service),
    user = Depends(get_current_user)
):
    """Get all phrase explanations for a specific metatext and user."""
    return service.get_phrase_explanations(metatext_id, user.id, session)

# --- New endpoint: Get all review data for a metatext ---
@router.get("/metatext/{metatext_id}/review", name="get_review_data", response_model=ReviewResponse)
def get_review_data(
    metatext_id: int,
    session: Session = Depends(get_session),
    service: ReviewService = Depends(get_review_service),
    user = Depends(get_current_user)
):
    """
    Get all review data for a specific metatext and user.
    Returns a dictionary with all relevant review data (wordlist, explanations, etc).
    """
    return service.get_review_data(metatext_id, user.id, session)

