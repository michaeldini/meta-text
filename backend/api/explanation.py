"""
Endpoints for defining and getting explanations.
The /explain is when the user wants to explain a word or a chunk.
The /metatext/{metatext_id}/review is when the user wants to get all explanation data for a specific metatext.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from backend.db import get_session
from backend.models import  ExplanationsResponse, ExplanationRequest
from backend.services.ai_service import AIService
from backend.services.explanation_service import ExplanationService 
from backend.dependencies import get_ai_service, get_explanation_service
from backend.services.auth_dependencies import get_current_user


router = APIRouter()

@router.post("/explain")
def explain(
    request: ExplanationRequest,
    session: Session = Depends(get_session),
    ai_service: AIService = Depends(get_ai_service),
    explanation_service: ExplanationService = Depends(get_explanation_service),
    user = Depends(get_current_user)
):
    """
    Consolidated endpoint for explaining words or a chunk. Requires authentication.
    Determines the operation based on which fields are provided.
    """

    print(f"Request: {request}")
    if request.chunk_id is not None:
        # Chunk explanation
        return ai_service.generate_chunk_explanation(user, request.chunk_id, session)
    elif request.metatext_id is not None:
        # Words explanation (words and context are required fields, so they'll always be present)
        return explanation_service.explain(
            user=user,
            words=request.words,
            context=request.context,
            metatext_id=request.metatext_id,
            session=session
        )
    else:
        raise HTTPException(status_code=400, detail="metatext_id is required for words explanation.")


@router.get("/metatext/{metatext_id}/review", name="get_review_data", response_model=ExplanationsResponse)
def get_review_data(
    metatext_id: int,
    session: Session = Depends(get_session),
    service: ExplanationService = Depends(get_explanation_service),
    user = Depends(get_current_user)
):
    """
    Get all review data for a specific metatext and user.
    Returns a dictionary with all relevant review data (wordlist, explanations, etc).
    """
    return service.get_review_data(metatext_id, user.id, session)

