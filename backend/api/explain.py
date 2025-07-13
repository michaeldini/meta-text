"""
Consolidated endpoint for defining/explaining words or a chunk.
This endpoint determines the operation based on which fields are provided.
If `chunkId` is provided, it generates a chunk explanation.
If `metaTextId` and `words` are provided, it uses the consolidated words explanation service.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from sqlmodel import Session
from backend.db import get_session
from backend.services.ai_service import AIService
from backend.services.words_explanation_service import WordsExplanationService

router = APIRouter()
ai_service = AIService()
words_explanation_service = WordsExplanationService()

class ExplainRequest(BaseModel):
    words: str = Field(..., description="Word(s) to explain")
    context: str = Field(..., description="Context for the explanation")
    chunkId: Optional[int] = Field(None, description="Chunk ID for chunk explanation")
    metaTextId: Optional[int] = Field(None, description="MetaText ID for explanation")

@router.post("/explain")
def explain(
    request: ExplainRequest,
    session: Session = Depends(get_session)
):
    """
    Consolidated endpoint for explaining words or a chunk.
    Determines the operation based on which fields are provided.
    """
    if request.chunkId is not None:
        # Chunk explanation
        return ai_service.generate_chunk_explanation(request.chunkId, session)
    elif request.metaTextId is not None and request.words:
        # Use the new consolidated words explanation service
        return words_explanation_service.explain(
            words=request.words,
            context=request.context,
            meta_text_id=request.metaTextId,
            session=session
        )
    else:
        raise HTTPException(status_code=400, detail="Insufficient data to determine explanation type.")
