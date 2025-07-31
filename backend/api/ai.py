from fastapi import APIRouter, HTTPException, Depends, Form, status
from sqlmodel import Session

from backend.models import (
     Rewrite, SourceDocInfoResponse, ImageRead, User
)
from backend.db import get_session

from backend.dependencies import get_ai_service, get_current_user
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
from backend.services import AIService

router = APIRouter()

@router.get("/evaluation/{chunk_id}")
async def generate_evaluation(
    chunk_id: int,
    session: Session = Depends(get_session),
    user = Depends(get_current_user),
    ai_service = Depends(get_ai_service)
) -> dict:
    """Generate AI evaluation for chunk note, summary, and text. Requires authentication."""
    try:
        return ai_service.generate_evaluation(chunk_id, session)
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
    user: User = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service)
) -> SourceDocInfoResponse:
    """Generate source document information using AI. Requires authentication."""
    try:
        return ai_service.generate_source_document_info(doc_id, session)
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
    user = Depends(get_current_user),
    ai_service = Depends(get_ai_service)
):
    """Generate AI image using DALL-E. Requires authentication."""
    try:
        return ai_service.generate_image(prompt, chunk_id, session)
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



@router.get("/generate-rewrite/{chunk_id}")
async def generate_rewrite(
    chunk_id: int,
    style_title: str,
    session: Session = Depends(get_session),
    user = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service)
) -> Rewrite:
    """Generate a compressed version of a chunk's text in a given style using AI (does not save). Requires authentication."""
    try:
        return ai_service.generate_rewrite(chunk_id, style_title, session)
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

