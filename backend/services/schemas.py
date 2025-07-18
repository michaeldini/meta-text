"""
Pydantic schemas for authentication and user operations.
"""
from pydantic import BaseModel
from datetime import timedelta

class Token(BaseModel):
    """Access token returned after authentication."""
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    """Schema for creating a new user."""
    username: str
    password: str


class UserRead(BaseModel):
    """Schema for reading user information."""
    id: int
    username: str

class LoginRequest(BaseModel):
    """Request body for user login."""
    username: str
    password: str

class LoginTokens(BaseModel):
    """Tokens returned after user login."""
    access_token: str
    refresh_token: str
    refresh_token_expires: timedelta  # seconds until expiration
    token_type: str = "bearer"