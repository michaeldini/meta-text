"""Authentication service for user management operations."""
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import select, Session
from loguru import logger
from fastapi import Response

from backend.models import User
from backend.exceptions.auth_exceptions import (
    UserNotFoundError,
    UsernameAlreadyExistsError,
    InvalidCredentialsError,
    UserRegistrationError,
    InvalidTokenError,
    TokenMissingUserIdError
)
# from passlib.context import CryptContext
from backend.services.password_utils import hash_password, verify_password
from backend.services.jwt_utils import create_access_token, create_refresh_token, decode_jwt_and_get_user_id, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS
import jwt

## Password hashing and verification now handled by password_utils
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


class AuthService:

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
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(
            data={"sub": user.username}, expires_delta=refresh_token_expires
        )
        return access_token, refresh_token


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
            hashed_pw = hash_password(password)
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
            if not verify_password(password, user.hashed_password):
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
        return create_access_token(data={"sub": user.username})

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
            raise InvalidTokenError("Missing refresh token")
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
            if payload.get("type") != "refresh":
                raise InvalidTokenError("Invalid token type")
            username = payload.get("sub")
            if username is None:
                raise TokenMissingUserIdError()
        except Exception as e:
            raise InvalidTokenError(str(e))
        user = self.get_user_by_username(username, session)
        if user is None:
            raise UserNotFoundError(username)
        access_token_expires = self.get_access_token_expires()
        refresh_token_expires = self.get_refresh_token_expires()
        access_token, new_refresh_token = self.generate_tokens(user, access_token_expires, refresh_token_expires)
        return user, access_token, new_refresh_token, refresh_token_expires





# FastAPI auth dependencies are now in backend.services.auth_dependencies
