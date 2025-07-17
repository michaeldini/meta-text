"""Authentication service for user management operations."""
from datetime import datetime, timedelta, timezone
import os
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
import jwt
from pydantic import BaseModel
from sqlmodel import select, Session
from loguru import logger
from fastapi import Depends, HTTPException, status, Response
from backend.models import User
from backend.exceptions.auth_exceptions import (
    InvalidTokenError,
    UserNotFoundError,
    UsernameAlreadyExistsError,
    InvalidCredentialsError,
    UserRegistrationError
)
# from passlib.context import CryptContext
from dotenv import load_dotenv
from backend.db import get_session
from passlib.context import CryptContext

# --- Password Hashing ---
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

load_dotenv()

_secret = os.environ.get("SECRET_KEY")
if not _secret:
    raise RuntimeError("SECRET_KEY environment variable is not set. Please set it in your .env file.")
SECRET_KEY: str = _secret
ALGORITHM = os.environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", 7))




class AuthService:
    @staticmethod
    def decode_jwt_and_get_user_id(token: str) -> str:
        """
        Decode a JWT token and extract the user_id (sub).
        Raises InvalidTokenError if invalid or missing sub.
        """
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if user_id is None:
                logger.warning("Token missing user_id (sub)")
                raise InvalidTokenError("Token missing user_id (sub)")
            return user_id
        except Exception as e:
            logger.warning(f"JWTError during token validation: {e}")
            raise InvalidTokenError(str(e))
    """Service for authentication and user management operations."""

    def __init__(self):
        pass

    def get_access_token_expires(self) -> timedelta:
        return timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    def get_refresh_token_expires(self) -> timedelta:
        return timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    def set_refresh_token_cookie(self, response: Response, refresh_token: str, refresh_token_expires: timedelta):
        """Set the refresh token as an httpOnly cookie on the response."""
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            max_age=int(refresh_token_expires.total_seconds()),
            expires=int(refresh_token_expires.total_seconds()),
            samesite="lax",
            secure=False  # Set to True in production with HTTPS
        )

    def generate_tokens(self, user, access_token_expires: timedelta, refresh_token_expires: timedelta):
        """Generate access and refresh tokens for a user."""
        access_token = self.create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        refresh_token = self.create_refresh_token(
            data={"sub": user.username}, expires_delta=refresh_token_expires
        )
        return access_token, refresh_token

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: timedelta | None = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def create_refresh_token(self, data: dict, expires_delta: timedelta | None = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def get_user_by_id(self, user_id: int, session: Session) -> User:
        logger.debug(f"Getting user by id: {user_id}")
        user = session.get(User, user_id)
        if not user:
            logger.warning(f"User not found for id: {user_id}")
            raise UserNotFoundError(user_id)
        logger.debug(f"User found: id={user.id}, username={user.username}")
        return user

    def get_user_by_username(self, username: str, session: Session) -> User:
        logger.debug(f"Getting user by username: {username}")
        user = session.exec(select(User).where(User.username == username)).first()
        if not user:
            logger.warning(f"User not found for username: {username}")
            raise UserNotFoundError(username)
        logger.debug(f"User found: id={user.id}, username={user.username}")
        return user

    def register_user(self, username: str, password: str, session: Session) -> User:
        logger.info(f"Registering new user: {username}")
        existing_user = session.exec(select(User).where(User.username == username)).first()
        if existing_user:
            logger.warning(f"Attempt to register duplicate username: {username}")
            raise UsernameAlreadyExistsError(username)
        try:
            hashed_pw = self.get_password_hash(password)
            new_user = User(username=username, hashed_password=hashed_pw)
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            logger.info(f"User registered successfully: {username} (id={new_user.id})")
            return new_user
        except Exception as e:
            session.rollback()
            logger.error(f"Error registering user {username}: {e}")
            raise UserRegistrationError(username, str(e))

    def authenticate_user(self, username: str, password: str, session: Session) -> User:
        logger.info(f"Authenticating user: {username}")
        try:
            user = self.get_user_by_username(username, session)
            if not self.verify_password(password, user.hashed_password):
                logger.warning(f"Invalid password for user: {username}")
                raise InvalidCredentialsError(username)
            logger.info(f"Authentication successful for user: {username} (id={user.id})")
            return user
        except UserNotFoundError:
            logger.warning(f"Authentication failed - user not found: {username}")
            raise InvalidCredentialsError(username)

    def create_login_token(self, user: User) -> str:
        logger.debug(f"Creating login token for user: {user.username} (id={user.id})")
        # Always use username in 'sub' claim for consistency
        return self.create_access_token(data={"sub": user.username})

    def get_user_from_token(self, token: str, session: Session) -> User:
        logger.debug("Getting user from token")
        user_id = decode_jwt_and_get_user_id(token)
        user = self.get_user_by_id(int(user_id), session)
        logger.debug(f"User from token: id={user.id}, username={user.username}")
        return user

    def login_user(self, username: str, password: str, session: Session) -> dict:
        user = self.authenticate_user(username, password, session)
        access_token = self.create_login_token(user)
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    def refresh_access_token(self, refresh_token: str, session: Session) -> tuple:
        if not refresh_token:
            from backend.exceptions.auth_exceptions import InvalidTokenError
            raise InvalidTokenError("Missing refresh token")
        try:
            import jwt
            from backend.exceptions.auth_exceptions import InvalidTokenError, TokenMissingUserIdError, UserNotFoundError
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
            if payload.get("type") != "refresh":
                raise InvalidTokenError("Invalid token type")
            username = payload.get("sub")
            if username is None:
                raise TokenMissingUserIdError()
        except Exception as e:
            from backend.exceptions.auth_exceptions import InvalidTokenError
            raise InvalidTokenError(str(e))
        user = self.get_user_by_username(username, session)
        if user is None:
            from backend.exceptions.auth_exceptions import UserNotFoundError
            raise UserNotFoundError(username)
        access_token_expires = self.get_access_token_expires()
        refresh_token_expires = self.get_refresh_token_expires()
        access_token, new_refresh_token = self.generate_tokens(user, access_token_expires, refresh_token_expires)
        return user, access_token, new_refresh_token, refresh_token_expires


auth_service = AuthService()


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


# --- JWT decode helper ---
def decode_jwt_and_get_user_id(token: str) -> str:
    """
    Decode a JWT token and extract the user_id (sub).
    Raises InvalidTokenError if invalid or missing sub.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            logger.warning("Token missing user_id (sub)")
            raise InvalidTokenError("Token missing user_id (sub)")
        return user_id
    except Exception as e:
        logger.warning(f"JWTError during token validation: {e}")
        raise InvalidTokenError(str(e))

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    if token_data.username is None:
        raise credentials_exception
    user = auth_service.get_user_by_username(token_data.username, session)
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
