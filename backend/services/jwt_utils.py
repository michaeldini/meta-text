"""
JWT utility functions for encoding, decoding, and validating tokens.
Handles access and refresh token creation and decoding.
"""
import os
from datetime import datetime, timedelta, timezone

import jwt
from jwt.exceptions import ExpiredSignatureError
from loguru import logger

from backend.exceptions.auth_exceptions import InvalidTokenError


_secret = os.environ.get("SECRET_KEY")
if not _secret:
    # Allow tests to run by using a fallback secret key
    import sys
    if any("pytest" in arg or "unittest" in arg for arg in sys.argv):
        _secret = "testsecretkey"
    else:
        raise RuntimeError("SECRET_KEY environment variable is not set. Please set it in your .env file.")
SECRET_KEY: str = _secret
ALGORITHM = os.environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", 7))

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a JWT refresh token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_jwt_and_get_user_id(token: str) -> str:
    """
    Decode a JWT token and extract the user_id (sub).
    Raises InvalidTokenError if invalid or missing sub.
    Handles expired tokens gracefully.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            logger.warning("Token missing user_id (sub)")
            raise InvalidTokenError("Token missing user_id (sub)")
        return user_id
    except ExpiredSignatureError:
        logger.warning("JWT token has expired")
        raise InvalidTokenError("Token has expired. Please log in again.")
    except Exception as e:
        logger.warning(f"JWTError during token validation: {e}")
        raise InvalidTokenError(str(e))
