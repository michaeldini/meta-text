"""JWT token service for authentication operations."""
from jose import jwt, JWTError
from datetime import datetime, timedelta
from loguru import logger
import os

from backend.exceptions.auth_exceptions import InvalidTokenError, TokenMissingUserIdError


class TokenService:
    """Service for JWT token operations."""
    
    def __init__(self):
        self.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key")
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 60
    
    def create_access_token(self, data: dict, expires_delta: timedelta | None = None) -> str:
        """
        Create a JWT access token.
        
        Args:
            data: Dictionary of data to encode in the token
            expires_delta: Optional custom expiration time
            
        Returns:
            Encoded JWT token string
        """
        logger.debug(f"Creating access token for data: {list(data.keys())}")
        
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=self.access_token_expire_minutes))
        to_encode.update({"exp": expire})
        
        token = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        logger.debug("Access token created successfully")
        return token
    
    def decode_access_token(self, token: str) -> dict:
        """
        Decode and validate a JWT access token.
        
        Args:
            token: JWT token string to decode
            
        Returns:
            Decoded token payload
            
        Raises:
            InvalidTokenError: If token is invalid or expired
            TokenMissingUserIdError: If token doesn't contain user ID
        """
        logger.debug("Decoding access token")
        
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            logger.debug("Token decoded successfully")
            
            # Validate required fields
            user_id = payload.get("sub")
            if user_id is None:
                logger.warning("Token missing user_id (sub)")
                raise TokenMissingUserIdError()
            
            return payload
            
        except JWTError as e:
            logger.warning(f"JWTError during token validation: {e}")
            raise InvalidTokenError(str(e))
    
    def get_user_id_from_token(self, token: str) -> str:
        """
        Extract user ID from a JWT token.
        
        Args:
            token: JWT token string
            
        Returns:
            User ID from token
            
        Raises:
            InvalidTokenError: If token is invalid
            TokenMissingUserIdError: If token doesn't contain user ID
        """
        payload = self.decode_access_token(token)
        return payload["sub"]
