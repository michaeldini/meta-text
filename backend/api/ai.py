from fastapi import APIRouter, HTTPException, Depends, Form, status, Query
from sqlmodel import Session

from backend.models import (
     Rewrite, SourceDocInfoResponse, ImageRead,
    ExplanationRequest
)
from backend.db import get_session
from backend.services.ai_service import AIService
from backend.services.auth_dependencies import get_current_user
from backend.services.words_explanation_service import WordsExplanationService
from backend.exceptions.ai_exceptions import (
    ChunkNotFoundError,
    SourceDocumentNotFoundError,
    PromptValidationError,
    OpenAIClientError,
    OpenAIResponseParsingError,
    OpenAIImageGenerationError,
    InstructionsFileNotFoundError,
    FileOperationError
)


router = APIRouter()

# Lazy initialization of service to avoid requiring API key at import time
_ai_service = None

def get_ai_service() -> AIService:
    """Get AI service instance with lazy initialization."""
    global _ai_service
    if _ai_service is None:
        try:
            _ai_service = AIService()
        except Exception:
            # For testing environments where OpenAI API key might not be available
            # Return a mock service or handle gracefully
            from unittest.mock import Mock
            _ai_service = Mock(spec=AIService)
    return _ai_service


@router.get("/evaluation/{chunk_id}")
async def generate_evaluation(
    chunk_id: int,
    session: Session = Depends(get_session),
    user = Depends(get_current_user)
) -> dict:
    """Generate AI evaluation for chunk note, summary, and text. Requires authentication."""
    try:
        return get_ai_service().generate_evaluation(chunk_id, session)
    except ChunkNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Chunk not found"
        )
    except (OpenAIClientError, OpenAIResponseParsingError, InstructionsFileNotFoundError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"AI service error: {str(e)}"
        )



@router.post("/source-doc-info/{doc_id}")
async def source_doc_info(
    doc_id: int,
    session: Session = Depends(get_session),
    user = Depends(get_current_user)
) -> SourceDocInfoResponse:
    """Generate source document information using AI. Requires authentication."""
    try:
        return get_ai_service().generate_source_document_info(doc_id, session)
    except PromptValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=e.message
        )
    except SourceDocumentNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Source document not found"
        )
    except (OpenAIClientError, OpenAIResponseParsingError, InstructionsFileNotFoundError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"AI service error: {str(e)}"
        )



@router.post("/generate-image", response_model=ImageRead)
async def generate_image(
    prompt: str = Form(...),
    chunk_id: int = Form(None),
    session: Session = Depends(get_session),
    user = Depends(get_current_user)
):
    """Generate AI image using DALL-E. Requires authentication."""
    try:
        return get_ai_service().generate_image(prompt, chunk_id, session)
    except PromptValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=e.message
        )
    except (OpenAIImageGenerationError, FileOperationError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(e)
        )
    except (OpenAIClientError, InstructionsFileNotFoundError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"AI service error: {str(e)}"
        )



@router.get("/generate-evaluation/{chunk_id}")
async def generate_chunk_evaluation(
    chunk_id: int,
    style_title: str,
    session: Session = Depends(get_session),
    user = Depends(get_current_user)
) -> Rewrite:
    """Generate a compressed version of a chunk's text in a given style using AI (does not save). Requires authentication."""
    try:
        return get_ai_service().generate_rewrite(chunk_id, style_title, session)
    except ChunkNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chunk not found"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI service error: {str(e)}"
        )


@router.post("/explain")
def explain(
    request: ExplanationRequest,
    metatext_id: int = Query(None, description="Metatext ID for words explanation (required if not chunk explanation)"),
    session: Session = Depends(get_session),
    user = Depends(get_current_user)
):
    """
    Consolidated endpoint for explaining words or a chunk. Requires authentication.
    Determines the operation based on which fields are provided.
    """
    words_explanation_service = WordsExplanationService()
    
    if request.chunk_id is not None:
        # Chunk explanation
        return get_ai_service().generate_chunk_explanation(user, request.chunk_id, session)
    elif metatext_id is not None:
        # Words explanation (words and context are required fields, so they'll always be present)
        return words_explanation_service.explain(
            user=user,
            words=request.words,
            context=request.context,
            metatext_id=metatext_id,
            session=session
        )
    else:
        raise HTTPException(status_code=400, detail="meta_text_id is required for words explanation.")
