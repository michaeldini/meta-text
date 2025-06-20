"""Authentication service for user management operations."""
from sqlmodel import select, Session
from loguru import logger

from backend.models import User, hash_password, verify_password
from backend.exceptions.auth_exceptions import (
    UserNotFoundError,
    UsernameAlreadyExistsError,
    InvalidCredentialsError,
    UserRegistrationError
)
from backend.services.token_service import TokenService


class AuthService:
    """Service for authentication and user management operations."""
    
    def __init__(self, token_service: TokenService | None = None):
        self.token_service = token_service or TokenService()
    
    def get_user_by_id(self, user_id: int, session: Session) -> User:
        """
        Get a user by ID.
        
        Args:
            user_id: The ID of the user
            session: Database session
            
        Returns:
            User object
            
        Raises:
            UserNotFoundError: If user is not found
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
        Get a user by username.
        
        Args:
            username: The username to search for
            session: Database session
            
        Returns:
            User object
            
        Raises:
            UserNotFoundError: If user is not found
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
        Register a new user.
        
        Args:
            username: The username for the new user
            password: The plain text password
            session: Database session
            
        Returns:
            Created User object
            
        Raises:
            UsernameAlreadyExistsError: If username already exists
            UserRegistrationError: If registration fails
        """
        logger.info(f"Registering new user: {username}")
        
        # Check if username already exists
        existing_user = session.exec(select(User).where(User.username == username)).first()
        if existing_user:
            logger.warning(f"Attempt to register duplicate username: {username}")
            raise UsernameAlreadyExistsError(username)
        
        try:
            # Hash password and create user
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
        Authenticate a user with username and password.
        
        Args:
            username: The username
            password: The plain text password
            session: Database session
            
        Returns:
            Authenticated User object
            
        Raises:
            InvalidCredentialsError: If credentials are invalid
        """
        logger.info(f"Authenticating user: {username}")
        
        try:
            user = self.get_user_by_username(username, session)
            
            # Verify password
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
        Create a login token for a user.
        
        Args:
            user: The user to create a token for
            
        Returns:
            JWT access token
        """
        logger.debug(f"Creating login token for user: {user.username} (id={user.id})")
        return self.token_service.create_access_token(data={"sub": str(user.id)})
    
    def get_user_from_token(self, token: str, session: Session) -> User:
        """
        Get user information from a JWT token.
        
        Args:
            token: JWT access token
            session: Database session
            
        Returns:
            User object
            
        Raises:
            InvalidTokenError: If token is invalid
            TokenMissingUserIdError: If token doesn't contain user ID
            UserNotFoundError: If user from token is not found
        """
        logger.debug("Getting user from token")
        
        # Decode token and extract user ID
        user_id = self.token_service.get_user_id_from_token(token)
        
        # Get user from database
        user = self.get_user_by_id(int(user_id), session)
        
        logger.debug(f"User from token: id={user.id}, username={user.username}")
        return user
    
    def login_user(self, username: str, password: str, session: Session) -> dict:
        """
        Complete login flow: authenticate user and create token.
        
        Args:
            username: The username
            password: The plain text password
            session: Database session
            
        Returns:
            Dictionary with access_token and token_type
            
        Raises:
            InvalidCredentialsError: If credentials are invalid
        """
        # Authenticate user
        user = self.authenticate_user(username, password, session)
        
        # Create token
        access_token = self.create_login_token(user)
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
