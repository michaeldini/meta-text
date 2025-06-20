"""Unit tests for authentication services."""
import pytest
from unittest.mock import Mock, patch
from sqlmodel import Session
from jose import jwt
from datetime import datetime, timedelta

from backend.services.auth_service import AuthService
from backend.services.token_service import TokenService
from backend.exceptions.auth_exceptions import (
    UserNotFoundError,
    UsernameAlreadyExistsError,
    InvalidCredentialsError,
    UserRegistrationError,
    InvalidTokenError,
    TokenMissingUserIdError
)
from backend.models import User


class TestTokenService:
    """Test cases for TokenService."""

    def setup_method(self):
        """Setup test fixtures."""
        self.token_service = TokenService()
        self.test_data = {"sub": "123", "username": "testuser"}

    def test_create_access_token_success(self):
        """Test successful token creation."""
        token = self.token_service.create_access_token(self.test_data)
        
        assert isinstance(token, str)
        assert len(token) > 0
        
        # Verify token can be decoded
        payload = jwt.decode(token, self.token_service.secret_key, algorithms=[self.token_service.algorithm])
        assert payload["sub"] == "123"
        assert payload["username"] == "testuser"
        assert "exp" in payload

    def test_create_access_token_with_custom_expiry(self):
        """Test token creation with custom expiry."""
        custom_expiry = timedelta(minutes=30)
        start_time = datetime.utcnow()
        token = self.token_service.create_access_token(self.test_data, custom_expiry)
        
        payload = jwt.decode(token, self.token_service.secret_key, algorithms=[self.token_service.algorithm])
        
        # Check that expiry is approximately 30 minutes from start time
        # Use utcfromtimestamp to handle timezone correctly
        exp_time = datetime.utcfromtimestamp(payload["exp"])
        expected_time = start_time + custom_expiry
        time_diff = abs((exp_time - expected_time).total_seconds())
        assert time_diff < 10  # Allow 10 second tolerance for test execution time

    def test_decode_access_token_success(self):
        """Test successful token decoding."""
        token = self.token_service.create_access_token(self.test_data)
        payload = self.token_service.decode_access_token(token)
        
        assert payload["sub"] == "123"
        assert payload["username"] == "testuser"
        assert "exp" in payload

    def test_decode_access_token_invalid_token(self):
        """Test decoding invalid token."""
        with pytest.raises(InvalidTokenError):
            self.token_service.decode_access_token("invalid_token")

    def test_decode_access_token_expired_token(self):
        """Test decoding expired token."""
        # Create token with negative expiry to make it immediately expired
        expired_token = self.token_service.create_access_token(
            self.test_data, 
            timedelta(seconds=-1)
        )
        
        with pytest.raises(InvalidTokenError):
            self.token_service.decode_access_token(expired_token)

    def test_decode_access_token_missing_user_id(self):
        """Test decoding token without user ID."""
        data_without_sub = {"username": "testuser"}
        token = self.token_service.create_access_token(data_without_sub)
        
        with pytest.raises(TokenMissingUserIdError):
            self.token_service.decode_access_token(token)

    def test_get_user_id_from_token_success(self):
        """Test successful user ID extraction from token."""
        token = self.token_service.create_access_token(self.test_data)
        user_id = self.token_service.get_user_id_from_token(token)
        
        assert user_id == "123"

    def test_get_user_id_from_token_invalid_token(self):
        """Test user ID extraction from invalid token."""
        with pytest.raises(InvalidTokenError):
            self.token_service.get_user_id_from_token("invalid_token")

    def test_get_user_id_from_token_missing_sub(self):
        """Test user ID extraction from token without sub."""
        data_without_sub = {"username": "testuser"}
        token = self.token_service.create_access_token(data_without_sub)
        
        with pytest.raises(TokenMissingUserIdError):
            self.token_service.get_user_id_from_token(token)


class TestAuthService:
    """Test cases for AuthService."""

    def setup_method(self):
        """Setup test fixtures."""
        self.mock_token_service = Mock(spec=TokenService)
        self.auth_service = AuthService(token_service=self.mock_token_service)
        self.mock_session = Mock(spec=Session)
        
        # Create test user
        self.test_user = User(
            id=1,
            username="testuser",
            hashed_password="hashed_password_123"
        )

    def test_get_user_by_id_success(self):
        """Test successful user retrieval by ID."""
        self.mock_session.get.return_value = self.test_user
        
        result = self.auth_service.get_user_by_id(1, self.mock_session)
        
        assert result == self.test_user
        self.mock_session.get.assert_called_once_with(User, 1)

    def test_get_user_by_id_not_found(self):
        """Test user retrieval by ID when user not found."""
        self.mock_session.get.return_value = None
        
        with pytest.raises(UserNotFoundError) as exc_info:
            self.auth_service.get_user_by_id(999, self.mock_session)
        
        assert exc_info.value.identifier == 999

    def test_get_user_by_username_success(self):
        """Test successful user retrieval by username."""
        mock_result = Mock()
        mock_result.first.return_value = self.test_user
        self.mock_session.exec.return_value = mock_result
        
        result = self.auth_service.get_user_by_username("testuser", self.mock_session)
        
        assert result == self.test_user
        self.mock_session.exec.assert_called_once()

    def test_get_user_by_username_not_found(self):
        """Test user retrieval by username when user not found."""
        mock_result = Mock()
        mock_result.first.return_value = None
        self.mock_session.exec.return_value = mock_result
        
        with pytest.raises(UserNotFoundError) as exc_info:
            self.auth_service.get_user_by_username("nonexistent", self.mock_session)
        
        assert exc_info.value.identifier == "nonexistent"

    @patch('backend.services.auth_service.hash_password')
    def test_register_user_success(self, mock_hash_password):
        """Test successful user registration."""
        mock_hash_password.return_value = "hashed_password_123"
        
        # Mock that username doesn't exist
        mock_result = Mock()
        mock_result.first.return_value = None
        self.mock_session.exec.return_value = mock_result
        
        # Mock the created user - will be set by refresh mock
        self.mock_session.refresh = Mock(side_effect=lambda user: setattr(user, 'id', 1))
        
        self.auth_service.register_user("newuser", "password123", self.mock_session)
        
        mock_hash_password.assert_called_once_with("password123")
        self.mock_session.add.assert_called_once()
        self.mock_session.commit.assert_called_once()
        self.mock_session.refresh.assert_called_once()

    def test_register_user_username_exists(self):
        """Test user registration when username already exists."""
        # Mock that username already exists
        mock_result = Mock()
        mock_result.first.return_value = self.test_user
        self.mock_session.exec.return_value = mock_result
        
        with pytest.raises(UsernameAlreadyExistsError) as exc_info:
            self.auth_service.register_user("testuser", "password123", self.mock_session)
        
        assert exc_info.value.username == "testuser"
        self.mock_session.add.assert_not_called()

    @patch('backend.services.auth_service.hash_password')
    def test_register_user_database_error(self, mock_hash_password):
        """Test user registration when database error occurs."""
        mock_hash_password.return_value = "hashed_password_123"
        
        # Mock that username doesn't exist
        mock_result = Mock()
        mock_result.first.return_value = None
        self.mock_session.exec.return_value = mock_result
        
        # Mock database error
        self.mock_session.commit.side_effect = Exception("Database error")
        
        with pytest.raises(UserRegistrationError) as exc_info:
            self.auth_service.register_user("newuser", "password123", self.mock_session)
        
        assert exc_info.value.username == "newuser"
        assert "Database error" in exc_info.value.reason
        self.mock_session.rollback.assert_called_once()

    @patch('backend.services.auth_service.verify_password')
    def test_authenticate_user_success(self, mock_verify_password):
        """Test successful user authentication."""
        mock_verify_password.return_value = True
        
        # Mock get_user_by_username
        with patch.object(self.auth_service, 'get_user_by_username', return_value=self.test_user):
            result = self.auth_service.authenticate_user("testuser", "password123", self.mock_session)
        
        assert result == self.test_user
        mock_verify_password.assert_called_once_with("password123", "hashed_password_123")

    @patch('backend.services.auth_service.verify_password')
    def test_authenticate_user_wrong_password(self, mock_verify_password):
        """Test user authentication with wrong password."""
        mock_verify_password.return_value = False
        
        # Mock get_user_by_username
        with patch.object(self.auth_service, 'get_user_by_username', return_value=self.test_user):
            with pytest.raises(InvalidCredentialsError) as exc_info:
                self.auth_service.authenticate_user("testuser", "wrongpassword", self.mock_session)
        
        assert exc_info.value.username == "testuser"

    def test_authenticate_user_user_not_found(self):
        """Test user authentication when user not found."""
        # Mock get_user_by_username to raise UserNotFoundError
        with patch.object(self.auth_service, 'get_user_by_username', side_effect=UserNotFoundError("testuser")):
            with pytest.raises(InvalidCredentialsError) as exc_info:
                self.auth_service.authenticate_user("testuser", "password123", self.mock_session)
        
        assert exc_info.value.username == "testuser"

    def test_create_login_token(self):
        """Test login token creation."""
        self.mock_token_service.create_access_token.return_value = "test_token"
        
        result = self.auth_service.create_login_token(self.test_user)
        
        assert result == "test_token"
        self.mock_token_service.create_access_token.assert_called_once_with(data={"sub": "1"})

    def test_get_user_from_token_success(self):
        """Test successful user retrieval from token."""
        self.mock_token_service.get_user_id_from_token.return_value = "1"
        
        with patch.object(self.auth_service, 'get_user_by_id', return_value=self.test_user):
            result = self.auth_service.get_user_from_token("test_token", self.mock_session)
        
        assert result == self.test_user
        self.mock_token_service.get_user_id_from_token.assert_called_once_with("test_token")

    def test_get_user_from_token_invalid_token(self):
        """Test user retrieval from invalid token."""
        self.mock_token_service.get_user_id_from_token.side_effect = InvalidTokenError("Invalid token")
        
        with pytest.raises(InvalidTokenError):
            self.auth_service.get_user_from_token("invalid_token", self.mock_session)

    def test_get_user_from_token_user_not_found(self):
        """Test user retrieval from token when user not found."""
        self.mock_token_service.get_user_id_from_token.return_value = "999"
        
        with patch.object(self.auth_service, 'get_user_by_id', side_effect=UserNotFoundError(999)):
            with pytest.raises(UserNotFoundError):
                self.auth_service.get_user_from_token("test_token", self.mock_session)

    def test_login_user_success(self):
        """Test successful user login."""
        self.mock_token_service.create_access_token.return_value = "test_token"
        
        with patch.object(self.auth_service, 'authenticate_user', return_value=self.test_user):
            result = self.auth_service.login_user("testuser", "password123", self.mock_session)
        
        expected = {
            "access_token": "test_token",
            "token_type": "bearer"
        }
        assert result == expected

    def test_login_user_invalid_credentials(self):
        """Test user login with invalid credentials."""
        with patch.object(self.auth_service, 'authenticate_user', side_effect=InvalidCredentialsError("testuser")):
            with pytest.raises(InvalidCredentialsError):
                self.auth_service.login_user("testuser", "wrongpassword", self.mock_session)

    def test_auth_service_default_token_service(self):
        """Test that AuthService creates default TokenService when none provided."""
        auth_service = AuthService()
        assert isinstance(auth_service.token_service, TokenService)


class TestAuthServiceIntegration:
    """Integration tests for auth services working together."""

    def setup_method(self):
        """Setup test fixtures."""
        self.token_service = TokenService()
        self.auth_service = AuthService(token_service=self.token_service)

    def test_token_roundtrip(self):
        """Test creating and decoding tokens end-to-end."""
        test_user = User(id=42, username="integrationtest", hashed_password="hash")
        
        # Create token
        token = self.auth_service.create_login_token(test_user)
        
        # Decode token
        payload = self.token_service.decode_access_token(token)
        
        assert payload["sub"] == "42"
        assert "exp" in payload

    def test_user_id_extraction_roundtrip(self):
        """Test extracting user ID from created token."""
        test_user = User(id=123, username="roundtriptest", hashed_password="hash")
        
        # Create token
        token = self.auth_service.create_login_token(test_user)
        
        # Extract user ID
        user_id = self.token_service.get_user_id_from_token(token)
        
        assert user_id == "123"
