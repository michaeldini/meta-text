
# Authentication endpoints and logic for the FastAPI backend.
# Handles user registration, login, logout, token refresh, and user info.
# Errors are caught by FastAPI's global exception handlers defined in main.py
from fastapi import APIRouter, Depends, Response, Cookie, Header, HTTPException, status, Request
from sqlmodel import Session
from backend.db import get_session
from backend.dependencies import AuthService 
from backend.services.schemas import Token, UserCreate, UserRead, LoginRequest


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
    """
    Register a new user.
    Accepts a JSON body with username and password.
    Returns the created user (without password).
    """
    new_user = auth_service.register_user(user.username, user.password, session)
    return UserRead.model_validate(new_user.model_dump())


@router.post("/auth/login", response_model=Token)
def login(
    response: Response,
    login_req: LoginRequest,
    session: Session = Depends(get_session),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Login and get access and refresh tokens.
    Accepts a JSON body with username and password.
    Returns an access token and sets a refresh token as an httpOnly cookie.
    """
    tokens = auth_service.login_user(login_req.username, login_req.password, session)
    # Set refresh token cookie from login_user result
    auth_service.set_refresh_token_cookie(response, tokens.refresh_token, tokens.refresh_token_expires)
    return Token(access_token=tokens.access_token, token_type="bearer")


@router.post("/auth/refresh", response_model=Token)
def refresh_token(
    # request: Request,  # Removed unused parameter
    response: Response,
    refresh_token: str = Cookie(None),
    session: Session = Depends(get_session),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Refresh access token using the refresh token from httpOnly cookie.
    Returns a new access token and sets a new refresh token cookie.
    """
    user, access_token, new_refresh_token, refresh_token_expires = auth_service.refresh_access_token(refresh_token, session)
    auth_service.set_refresh_token_cookie(response, new_refresh_token, refresh_token_expires)
    return Token(access_token=access_token, token_type="bearer")


@router.post("/auth/logout")
def logout(response: Response):
    """
    Logout the user by clearing the refresh token cookie.
    """
    response.delete_cookie(key="refresh_token", samesite="lax")
    return {"detail": "Logged out successfully."}




@router.get("/auth/me", response_model=UserRead)
async def read_users_me(
    request: Request,
    authorization: str = Header(None),
    session: Session = Depends(get_session),
    auth_service: AuthService = Depends(get_auth_service),
):
    """
    Get current user information from the access token.
    Requires a valid JWT in the Authorization header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization.split(" ", 1)[1]
    user = auth_service.get_user_from_access_token(token, session)
    return UserRead.model_validate(user.model_dump())

