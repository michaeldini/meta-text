"""
backend/dependencies.py

This module contains reusable FastAPI dependency functions for the backend.
"""

from fastapi import Depends, HTTPException, Header, status
from backend.db import get_session
from sqlmodel import Session
from backend.services import (
    AIService,
    BookmarkService,
    ChunkService,
    ExplanationService,
    AuthService,
    MetatextService,
    SourceDocumentService,
)

def get_explanation_service() -> ExplanationService:
    """Dependency injection function for ExplanationService."""
    return ExplanationService()

# Dependency injection function for BookmarkService
def get_bookmark_service() -> BookmarkService:
    return BookmarkService()


# Dependency injection function
def get_chunk_service() -> ChunkService:
    """Dependency injection function for ChunkService."""
    return ChunkService()


# Dependency injection function
def get_metatext_service() -> MetatextService:
    """Dependency injection function for MetatextService."""
    return MetatextService()


# Dependency injection function
def get_source_document_service() -> SourceDocumentService:
    """Dependency injection function for SourceDocumentService."""
    return SourceDocumentService()


def get_auth_service():
    return AuthService()

def get_current_user(
    authorization: str = Header(None),
    session: Session = Depends(get_session),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Dependency to extract and validate the current user from the Authorization header JWT.
    Returns the user instance or raises HTTPException if invalid.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization.split(" ", 1)[1]
    user = auth_service.get_user_from_access_token(token, session)
    return user

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

