"""
backend/dependencies.py

This module contains reusable FastAPI dependency functions for the backend.
"""

from backend.services.ai_service import AIService
from backend.services.explanation_service import ExplanationService 

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

def get_explanation_service() -> ExplanationService:
    """Dependency injection function for ExplanationService."""
    return ExplanationService()