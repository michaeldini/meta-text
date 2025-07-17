# This file handles authentication endpoints and logic for the FastAPI backend.
# raised errors should be caught by FastAPI's global exception handlers defined in main.py
from typing import Annotated
from fastapi import APIRouter, Depends, Response, Request, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from backend.db import get_session


from backend.services.auth_service import AuthService 
from backend.services.schemas import Token, UserCreate, UserRead
from backend.services.auth_dependencies import get_current_active_user

router = APIRouter()

# Dependency injection function for AuthService
def get_auth_service() -> AuthService:
    """Dependency injection function for AuthService."""
    return AuthService()

@router.post("/auth/register", response_model=UserRead)
def register(
    user: UserCreate,
    session: Session = Depends(get_session),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user."""
    new_user = auth_service.register_user(user.username, user.password, session)
    return UserRead.model_validate(new_user.model_dump())

@router.post("/auth/token", response_model=Token)
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Login and get access and refresh tokens."""

    tokens = auth_service.login_user(form_data.username, form_data.password, session)
    
    # Generate refresh token and set cookie
    user = auth_service.get_user_by_username(form_data.username, session)
    access_token_expires = auth_service.get_access_token_expires()
    refresh_token_expires = auth_service.get_refresh_token_expires()
    _, refresh_token = auth_service.generate_tokens(user, access_token_expires, refresh_token_expires)
    auth_service.set_refresh_token_cookie(response, refresh_token, refresh_token_expires)
    return Token(access_token=tokens["access_token"], token_type=tokens["token_type"])

@router.post("/auth/refresh", response_model=Token)
def refresh_token(
    request: Request,
    response: Response,
    refresh_token: str = Cookie(None),
    session: Session = Depends(get_session),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Refresh access token using refresh token from httpOnly cookie."""
    user, access_token, new_refresh_token, refresh_token_expires = auth_service.refresh_access_token(refresh_token, session)
    auth_service.set_refresh_token_cookie(response, new_refresh_token, refresh_token_expires)
    return Token(access_token=access_token, token_type="bearer")

@router.get("/auth/me", response_model=UserRead)
async def read_users_me(current_user: Annotated[UserRead, Depends(get_current_active_user)]):
    """Get current user information from token."""
    return current_user

