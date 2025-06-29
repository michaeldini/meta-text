from fastapi import APIRouter, HTTPException, Depends, Form, status
from sqlmodel import Session

from backend.models import (
    WordDefinitionResponse, WordDefinitionWithContextRequest, 
    SourceDocInfoRequest, SourceDocInfoResponse, AiImageRead
)
from backend.db import get_session
from backend.services.ai_service import AIService
from backend.exceptions.ai_exceptions import (
    ChunkNotFoundError,
    WordDefinitionValidationError,
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

@router.get("/generate-chunk-note-summary-text-comparison/{chunk_id}")
async def generate_chunk_note_summary_text_comparison(chunk_id: int, session: Session = Depends(get_session)) -> dict:
    """Generate AI comparison for chunk notes, summary, and text."""
    try:
        return get_ai_service().generate_chunk_comparison(chunk_id, session)
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
    
@router.post("/generate-definition-in-context")
async def generate_definition_in_context(request: WordDefinitionWithContextRequest, session: Session = Depends(get_session)) -> WordDefinitionResponse:
    """Generate word definition with context using AI."""
    try:
        return get_ai_service().generate_word_definition(request, session)
    except WordDefinitionValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Validation error - {e.field}: {e.message}"
        )
    except (OpenAIClientError, OpenAIResponseParsingError, InstructionsFileNotFoundError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"AI service error: {str(e)}"
        )


@router.post("/source-doc-info")
async def source_doc_info(request: SourceDocInfoRequest, session: Session = Depends(get_session)) -> SourceDocInfoResponse:
    """Generate source document information using AI."""
    try:
        return get_ai_service().generate_source_document_info(request, session)
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


@router.post("/generate-image", response_model=AiImageRead)
async def generate_image(prompt: str = Form(...), chunk_id: int = Form(None), session: Session = Depends(get_session)):
    """Generate AI image using DALL-E."""
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


@router.get("/generate-chunk-compression/{chunk_id}")
async def generate_chunk_compression(chunk_id: int, style_title: str, session: Session = Depends(get_session)) -> dict:
    """Generate a compressed version of a chunk's text in a given style using AI (does not save)."""
    try:
        return get_ai_service().generate_chunk_compression(chunk_id, style_title, session)
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


@router.get("/generate-chunk-explanation/{chunk_id}")
async def generate_chunk_explanation(chunk_id: int, session: Session = Depends(get_session)) -> dict:
    """Generate and save a detailed AI explanation for a chunk's text."""
    try:
        return get_ai_service().generate_chunk_explanation(chunk_id, session)
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


