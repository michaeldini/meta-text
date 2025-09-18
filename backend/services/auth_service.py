"""Authentication service for user management operations."""
import os
from datetime import timedelta
import loguru
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
from backend.services.schemas import LoginTokens
# from passlib.context import CryptContext

from backend.services.password_utils import hash_password, verify_password
from backend.services.jwt_utils import create_access_token, create_refresh_token, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS
import jwt




class AuthService:

    def get_user_from_access_token(self, token: str, session: Session):
        """
        Validate the JWT access token and return the user instance.
        Raises HTTPException for any auth error.
        """
        from fastapi import HTTPException, status
        import jwt
        from backend.services.jwt_utils import SECRET_KEY, ALGORITHM
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username = payload.get("sub")
            if not username:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token payload",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired. Please log in again.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = self.get_user_by_username(username, session)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    """
    Service for user authentication and account management.
    Handles registration, login, password hashing, and JWT token generation/refresh.
    """

    def __init__(self):
        pass

    def get_access_token_expires(self) -> timedelta:
        """Return timedelta for access token expiration."""
        return timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    def get_refresh_token_expires(self) -> timedelta:
        """Return timedelta for refresh token expiration."""
        return timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    def set_refresh_token_cookie(self, response: Response, refresh_token: str, refresh_token_expires: timedelta):
        """
        Set the refresh token as an httpOnly cookie on the response.
        """
        # Use secure cookies in production
        is_production = os.environ.get("ENVIRONMENT") == "production"
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            max_age=int(refresh_token_expires.total_seconds()),
            expires=int(refresh_token_expires.total_seconds()),
            samesite="lax",
            secure=is_production  # True in production with HTTPS
        )

    def set_access_token_cookie(self, response: Response, access_token: str, access_token_expires: timedelta):
        """
        Set the access token as an httpOnly cookie on the response.
        """
        # Use secure cookies in production
        is_production = os.environ.get("ENVIRONMENT") == "production"
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            max_age=int(access_token_expires.total_seconds()),
            expires=int(access_token_expires.total_seconds()),
            samesite="lax",
            secure=is_production  # True in production with HTTPS
        )

    def generate_tokens(self, user, access_token_expires: timedelta, refresh_token_expires: timedelta):
        """
        Generate access and refresh tokens for a user.
        Uses username as the JWT 'sub' claim for consistency.
        """
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(
            data={"sub": user.username}, expires_delta=refresh_token_expires
        )
        return access_token, refresh_token

    def get_user_by_id(self, user_id: int, session: Session) -> User:
        """
        Retrieve a user by their database ID.
        Raises UserNotFoundError if not found.
        """
        logger.debug(f"Getting user by id: {user_id}")
        user = session.get(User, user_id)
        if not user:
            logger.warning(f"User not found for id: {user_id}")
            raise UserNotFoundError(user_id)
        logger.debug(f"User found: id={user.id}, username={user.username}")
        return user

    def get_user_by_username(self, username: str, session: Session) -> User:
        """
        Retrieve a user by their username.
        Raises UserNotFoundError if not found.
        """
        logger.debug(f"Getting user by username: {username}")
        user = session.exec(select(User).where(User.username == username)).first()
        if not user:
            logger.warning(f"User not found for username: {username}")
            raise UserNotFoundError(username)
        logger.debug(f"User found: id={user.id}, username={user.username}")
        return user

    def register_user(self, username: str, password: str, session: Session) -> User:
        """
        Register a new user with a hashed password.
        Raises UsernameAlreadyExistsError if username is taken.
        """
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
        """
        Authenticate a user by username and password.
        Raises InvalidCredentialsError if authentication fails.
        """
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
        """
        Create a JWT access token for the user.
        Uses username as the 'sub' claim.
        """
        logger.debug(f"Creating login token for user: {user.username} (id={user.id})")
        return create_access_token(data={"sub": user.username})

    def login_user(self, username: str, password: str, session: Session) -> LoginTokens:
        """
        Authenticate user and return access and refresh token dict.
        """
        user = self.authenticate_user(username, password, session)
        access_token_expires = self.get_access_token_expires()
        refresh_token_expires = self.get_refresh_token_expires()
        access_token, refresh_token = self.generate_tokens(user, access_token_expires, refresh_token_expires)
        logger.info(f"User {username} logged in successfully, tokens generated.")
        return LoginTokens(
            access_token=access_token,
            refresh_token=refresh_token,
            refresh_token_expires=refresh_token_expires,
            token_type="bearer"
        )

    def refresh_access_token(self, refresh_token: str, session: Session) -> tuple:
        """
        Refresh access token using a valid refresh token.
        Returns (user, new_access_token, new_refresh_token, refresh_token_expires).
        Raises InvalidTokenError if token is invalid or expired.
        """
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
        logger.info(f"Access token refreshed for user: {username} (id={user.id})")
        if not new_refresh_token:
            raise InvalidTokenError("Failed to generate new refresh token")
        return user, access_token, new_refresh_token, refresh_token_expires
