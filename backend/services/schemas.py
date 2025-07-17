"""
Pydantic schemas for authentication and user operations.
"""
from pydantic import BaseModel

class RefreshToken(BaseModel):
    refresh_token: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class UserCreate(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: int
    username: str
