"""
Unit tests for AuthService (authentication service for user management operations).
Uses pytest and SQLModel's in-memory SQLite for isolation.
Tests registration, authentication, token generation, and error handling.
"""

import pytest
from sqlmodel import SQLModel, Session, create_engine
from backend.services.auth_service import AuthService
from backend.exceptions.auth_exceptions import (
    UserNotFoundError,
    UsernameAlreadyExistsError,
    InvalidCredentialsError,
    InvalidTokenError,
)

# Fixtures
@pytest.fixture(scope="module")
def engine():
    """Create a new in-memory SQLite engine for the test module."""
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    return engine

@pytest.fixture()
def session(engine):
    """Yield a new SQLModel session for each test."""
    with Session(engine) as session:
        yield session

@pytest.fixture()
def auth_service():
    """Return a new AuthService instance."""
    return AuthService()

# Tests
def test_register_and_authenticate_user(auth_service, session):
    """Test user registration and authentication logic."""
    user = auth_service.register_user("alice", "password123", session)
    assert user.username == "alice"
    # Authenticate with correct password
    user2 = auth_service.authenticate_user("alice", "password123", session)
    assert user2.id == user.id
    # Authenticate with wrong password
    with pytest.raises(InvalidCredentialsError):
        auth_service.authenticate_user("alice", "wrongpass", session)
    # Register duplicate username
    with pytest.raises(UsernameAlreadyExistsError):
        auth_service.register_user("alice", "anotherpass", session)

def test_get_user_by_id_and_username(auth_service, session):
    """Test fetching user by id and username, and error on not found."""
    user = auth_service.register_user("bob", "pw", session)
    fetched = auth_service.get_user_by_id(user.id, session)
    assert fetched.username == "bob"
    fetched2 = auth_service.get_user_by_username("bob", session)
    assert fetched2.id == user.id
    with pytest.raises(UserNotFoundError):
        auth_service.get_user_by_id(999, session)
    with pytest.raises(UserNotFoundError):
        auth_service.get_user_by_username("notfound", session)

def test_create_login_token_and_get_user_from_token(auth_service, session):
    """Test creating a login token and retrieving user from token."""
    user = auth_service.register_user("carol", "pw", session)
    token = auth_service.create_login_token(user)
    # get_user_from_access_token expects username in 'sub' claim
    user2 = auth_service.get_user_from_access_token(token, session)
    assert user2.username == "carol"

def test_login_user(auth_service, session):
    """Test login_user returns valid tokens and handles bad credentials."""
    _ = auth_service.register_user("dave", "pw", session)
    result = auth_service.login_user("dave", "pw", session)
    assert hasattr(result, "access_token")
    assert result.token_type == "bearer"
    with pytest.raises(InvalidCredentialsError):
        auth_service.login_user("dave", "wrong", session)

def test_refresh_access_token(auth_service, session):
    """Test refresh_access_token returns new tokens and handles errors."""
    user = auth_service.register_user("eve", "pw", session)
    access_token, refresh_token = auth_service.generate_tokens(
        user,
        auth_service.get_access_token_expires(),
        auth_service.get_refresh_token_expires(),
    )
    # Valid refresh
    user2, new_access, new_refresh, expires = auth_service.refresh_access_token(refresh_token, session)
    assert user2.username == "eve"
    assert new_access
    assert new_refresh
    # Invalid refresh token
    with pytest.raises(InvalidTokenError):
        auth_service.refresh_access_token("badtoken", session)
    # Missing refresh token
    with pytest.raises(InvalidTokenError):
        auth_service.refresh_access_token(None, session)
