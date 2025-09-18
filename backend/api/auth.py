
# Authentication endpoints and logic for the FastAPI backend.
# Handles user registration, login, logout, token refresh, and user info.
# Errors are caught by FastAPI's global exception handlers defined in main.py
from fastapi import APIRouter, Depends, Response, Cookie, Header, HTTPException, status, Request
from sqlmodel import Session
from loguru import logger
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from backend.db import get_session
from backend.dependencies import AuthService 
from backend.services.schemas import Token, UserCreate, UserRead, LoginRequest


router = APIRouter()

# Create limiter instance - this will be automatically shared when the app is configured
limiter = Limiter(key_func=get_remote_address)

# Dependency injection function for AuthService
def get_auth_service() -> AuthService:
    """Dependency injection function for AuthService."""
    return AuthService()


@router.post("/auth/register", response_model=UserRead)
@limiter.limit("3/minute", key_func=lambda request: f"register:{get_remote_address(request)}")  # 3 registration attempts per minute
def register(
    request: Request,  # Required for rate limiting
    user: UserCreate,
    session: Session = Depends(get_session),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Register a new user.
    Accepts a JSON body with username and password.
    Returns the created user (without password).
    """
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"User registration attempt for username: {user.username} from IP: {client_ip}")
    
    try:
        new_user = auth_service.register_user(user.username, user.password, session)
        logger.info(f"User registration successful for username: {user.username} (id={new_user.id}) from IP: {client_ip}")
        return UserRead.model_validate(new_user.model_dump())
    except Exception as e:
        logger.warning(f"User registration failed for username: {user.username} from IP: {client_ip} - {str(e)}")
        raise  # Re-raise to let global exception handlers handle it


@router.post("/auth/login")
@limiter.limit("5/minute", key_func=lambda request: f"login:{get_remote_address(request)}")  # 5 login attempts per minute
def login(
    request: Request,  # Required for rate limiting
    response: Response,
    login_req: LoginRequest,
    session: Session = Depends(get_session),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Login and get access and refresh tokens.
    Accepts a JSON body with username and password.
    Sets both access and refresh tokens as httpOnly cookies.
    Returns success message instead of exposing tokens.
    """
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"Login attempt for username: {login_req.username} from IP: {client_ip}")
    
    try:
        tokens = auth_service.login_user(login_req.username, login_req.password, session)
        # Set both tokens as httpOnly cookies
        access_token_expires = auth_service.get_access_token_expires()
        auth_service.set_access_token_cookie(response, tokens.access_token, access_token_expires)
        auth_service.set_refresh_token_cookie(response, tokens.refresh_token, tokens.refresh_token_expires)
        
        logger.info(f"Login successful for username: {login_req.username} from IP: {client_ip}")
        return {"message": "Login successful", "token_type": "bearer"}
    except Exception as e:
        logger.warning(f"Login failed for username: {login_req.username} from IP: {client_ip} - {str(e)}")
        raise  # Re-raise to let global exception handlers handle it


@router.post("/auth/refresh")
@limiter.limit("10/minute", key_func=lambda request: f"refresh:{get_remote_address(request)}")  # 10 refresh attempts per minute (more lenient for legitimate use)
def refresh_token(
    request: Request,  # Required for rate limiting
    response: Response,
    refresh_token: str = Cookie(None),
    session: Session = Depends(get_session),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Refresh access token using the refresh token from httpOnly cookie.
    Sets new access and refresh tokens as httpOnly cookies.
    Returns success message instead of exposing tokens.
    """
    client_ip = request.client.host if request.client else "unknown"
    
    if not refresh_token:
        logger.warning(f"Token refresh failed - missing refresh token from IP: {client_ip}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        user, access_token, new_refresh_token, refresh_token_expires = auth_service.refresh_access_token(refresh_token, session)
        # Set new tokens as httpOnly cookies
        access_token_expires = auth_service.get_access_token_expires()
        auth_service.set_access_token_cookie(response, access_token, access_token_expires)
        auth_service.set_refresh_token_cookie(response, new_refresh_token, refresh_token_expires)
        
        logger.info(f"Token refresh successful for user: {user.username} (id={user.id}) from IP: {client_ip}")
        return {"message": "Token refreshed successfully", "token_type": "bearer"}
    except Exception as e:
        logger.warning(f"Token refresh failed from IP: {client_ip} - {str(e)}")
        raise  # Re-raise to let global exception handlers handle it


@router.post("/auth/logout")
def logout(response: Response, request: Request):
    """
    Logout the user by clearing both access and refresh token cookies.
    """
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"User logout from IP: {client_ip}")
    
    response.delete_cookie(key="access_token", samesite="lax")
    response.delete_cookie(key="refresh_token", samesite="lax")
    return {"detail": "Logged out successfully."}




@router.get("/auth/me", response_model=UserRead)
async def read_users_me(
    request: Request,
    access_token: str = Cookie(None),
    session: Session = Depends(get_session),
    auth_service: AuthService = Depends(get_auth_service),
):
    """
    Get current user information from the access token cookie.
    Requires a valid JWT in the access_token httpOnly cookie.
    """
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing access token cookie",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = auth_service.get_user_from_access_token(access_token, session)
    return UserRead.model_validate(user.model_dump())

