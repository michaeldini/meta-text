"""
Auth-related FastAPI dependency functions for extracting and validating the current user from a JWT token.
"""
from fastapi import Depends, HTTPException, status
from typing import Annotated
from jwt.exceptions import ExpiredSignatureError
from backend.services.schemas import TokenData, UserRead
from backend.services.jwt_utils import SECRET_KEY, ALGORITHM
from backend.services.auth_service import AuthService
from backend.db import get_session

from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        import jwt
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except ExpiredSignatureError:
        from backend.exceptions.auth_exceptions import InvalidTokenError
        raise InvalidTokenError("Token has expired. Please log in again.")
    except Exception:
        raise credentials_exception
    if token_data.username is None:
        raise credentials_exception
    user = AuthService().get_user_by_username(token_data.username, session)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: Annotated[UserRead, Depends(get_current_user)],
):
    # If you have a 'disabled' field, check it here
    # if getattr(current_user, 'disabled', False):
    #     raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
