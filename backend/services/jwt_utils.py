
"""
Minimal JWT utility functions for encoding, decoding, and validating tokens.
All tokens use the username as the 'sub' claim.
"""

import os
from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import ExpiredSignatureError
from loguru import logger
from backend.exceptions.auth_exceptions import InvalidTokenError

# Load secret and algorithm from environment, fallback for tests
_secret = os.environ.get("SECRET_KEY")
if not _secret:
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
    """
    Create a JWT access token for a user.
    The 'sub' claim should be the username.
    Args:
        data: dict containing at least {'sub': username}
        expires_delta: Optional timedelta for expiration
    Returns:
        Encoded JWT as a string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a JWT refresh token for a user.
    The 'sub' claim should be the username. Adds 'type': 'refresh'.
    Args:
        data: dict containing at least {'sub': username}
        expires_delta: Optional timedelta for expiration
    Returns:
        Encoded JWT as a string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_jwt_and_get_user_id(token: str) -> str:
    """
    Decode a JWT token and extract the username from the 'sub' claim.
    Raises InvalidTokenError if invalid or missing 'sub'.
    Handles expired tokens gracefully.
    Args:
        token: JWT string
    Returns:
        Username (str) from the 'sub' claim
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            logger.warning("Token missing username (sub)")
            raise InvalidTokenError("Token missing username (sub)")
        return username
    except ExpiredSignatureError:
        logger.warning("JWT token has expired")
        raise InvalidTokenError("Token has expired. Please log in again.")
    except Exception as e:
        logger.warning(f"JWTError during token validation: {e}")
        raise InvalidTokenError(str(e))
