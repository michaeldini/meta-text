from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

from backend.db import get_session
from backend.services.auth_service import AuthService
from backend.exceptions.auth_exceptions import (
    UsernameAlreadyExistsError,
    InvalidCredentialsError,
    InvalidTokenError,
    TokenMissingUserIdError,
    UserNotFoundError,
    UserRegistrationError
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

router = APIRouter()

# Initialize service
auth_service = AuthService()


class UserCreate(BaseModel):
    username: str
    password: str


class UserRead(BaseModel):
    id: int
    username: str


class Token(BaseModel):
    access_token: str
    token_type: str


@router.post("/auth/register", response_model=UserRead)
def register(user: UserCreate, session: Session = Depends(get_session)):
    """Register a new user."""
    try:
        new_user = auth_service.register_user(user.username, user.password, session)
        return UserRead.model_validate(new_user.model_dump())
    except UsernameAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Username already registered"
        )
    except UserRegistrationError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Registration failed: {e.reason}"
        )


@router.post("/auth/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    """Login and get access token."""
    try:
        return auth_service.login_user(form_data.username, form_data.password, session)
    except InvalidCredentialsError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Incorrect username or password"
        )


@router.get("/auth/me", response_model=UserRead)
def read_users_me(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    """Get current user information from token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        user = auth_service.get_user_from_token(token, session)
        return UserRead.model_validate(user.model_dump())
    except (InvalidTokenError, TokenMissingUserIdError, UserNotFoundError):
        raise credentials_exception
