"""Custom exceptions for authentication operations."""


class AuthServiceError(Exception):
    """Base exception for authentication service errors."""
    pass


class UserNotFoundError(AuthServiceError):
    """Raised when a user is not found."""
    
    def __init__(self, identifier: str | int):
        self.identifier = identifier
        super().__init__(f"User not found: {identifier}")


class UsernameAlreadyExistsError(AuthServiceError):
    """Raised when trying to register a username that already exists."""
    
    def __init__(self, username: str):
        self.username = username
        super().__init__(f"Username already exists: {username}")


class InvalidCredentialsError(AuthServiceError):
    """Raised when login credentials are invalid."""
    
    def __init__(self, username: str):
        self.username = username
        super().__init__(f"Invalid credentials for username: {username}")


class InvalidTokenError(AuthServiceError):
    """Raised when a JWT token is invalid or expired."""
    
    def __init__(self, reason: str):
        self.reason = reason
        super().__init__(f"Invalid token: {reason}")


class TokenMissingUserIdError(AuthServiceError):
    """Raised when a token doesn't contain a user ID."""
    
    def __init__(self):
        super().__init__("Token missing user ID (sub)")


class UserRegistrationError(AuthServiceError):
    """Raised when user registration fails."""
    
    def __init__(self, username: str, reason: str):
        self.username = username
        self.reason = reason
        super().__init__(f"Registration failed for {username}: {reason}")
