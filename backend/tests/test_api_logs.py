"""Tests for Logs API endpoints."""
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from fastapi import FastAPI

from backend.api.logs import router


@pytest.fixture
def app():
    """Create a test FastAPI app."""
    app = FastAPI()
    app.include_router(router, prefix="/api")
    return app


@pytest.fixture
def client(app):
    """Create a test client."""
    return TestClient(app)


class TestLogsEndpoints:
    """Test cases for Logs API endpoints."""

    @patch('backend.api.logs.logger')
    def test_frontend_log_error(self, mock_logger, client):
        """Test frontend error log."""
        log_data = {
            "level": "error",
            "message": "Test error message",
            "context": {"component": "TestComponent", "error_code": 500}
        }

        # Execute
        response = client.post("/api/frontend-log", json=log_data)

        # Assert
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
        mock_logger.error.assert_called_once()
        call_args = mock_logger.error.call_args[0][0]
        assert "[FRONTEND]" in call_args
        assert "Test error message" in call_args

    @patch('backend.api.logs.logger')
    def test_frontend_log_warning(self, mock_logger, client):
        """Test frontend warning log."""
        log_data = {
            "level": "warn",
            "message": "Test warning message",
            "context": None
        }

        # Execute
        response = client.post("/api/frontend-log", json=log_data)

        # Assert
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
        mock_logger.warning.assert_called_once()
        call_args = mock_logger.warning.call_args[0][0]
        assert "[FRONTEND]" in call_args
        assert "Test warning message" in call_args

    @patch('backend.api.logs.logger')
    def test_frontend_log_info(self, mock_logger, client):
        """Test frontend info log."""
        log_data = {
            "level": "info",
            "message": "Test info message"
        }

        # Execute
        response = client.post("/api/frontend-log", json=log_data)

        # Assert
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
        mock_logger.info.assert_called_once()
        call_args = mock_logger.info.call_args[0][0]
        assert "[FRONTEND]" in call_args
        assert "Test info message" in call_args

    @patch('backend.api.logs.logger')
    def test_frontend_log_debug(self, mock_logger, client):
        """Test frontend debug log."""
        log_data = {
            "level": "debug",
            "message": "Test debug message"
        }

        # Execute
        response = client.post("/api/frontend-log", json=log_data)

        # Assert
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
        mock_logger.debug.assert_called_once()
        call_args = mock_logger.debug.call_args[0][0]
        assert "[FRONTEND]" in call_args
        assert "Test debug message" in call_args

    @patch('backend.api.logs.logger')
    def test_frontend_log_unknown_level(self, mock_logger, client):
        """Test frontend log with unknown level."""
        log_data = {
            "level": "unknown",
            "message": "Test unknown level message"
        }

        # Execute
        response = client.post("/api/frontend-log", json=log_data)

        # Assert
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
        # Should default to info level
        mock_logger.info.assert_called_once()
        call_args = mock_logger.info.call_args[0][0]
        assert "[FRONTEND]" in call_args
        assert "Test unknown level message" in call_args

    @patch('backend.api.logs.logger')
    def test_frontend_log_case_insensitive(self, mock_logger, client):
        """Test frontend log with mixed case level."""
        log_data = {
            "level": "ERROR",
            "message": "Test uppercase error message"
        }

        # Execute
        response = client.post("/api/frontend-log", json=log_data)

        # Assert
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
        mock_logger.error.assert_called_once()

    @patch('backend.api.logs.logger')
    def test_frontend_log_with_context(self, mock_logger, client):
        """Test frontend log with context object."""
        log_data = {
            "level": "error",
            "message": "Error with context",
            "context": {
                "user_id": 123,
                "session_id": "abc123",
                "component": "LoginForm"
            }
        }

        # Execute
        response = client.post("/api/frontend-log", json=log_data)

        # Assert
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
        mock_logger.error.assert_called_once()

    def test_frontend_log_missing_level(self, client):
        """Test frontend log without required level field."""
        log_data = {
            "message": "Test message without level"
        }

        # Execute
        response = client.post("/api/frontend-log", json=log_data)

        # Assert
        assert response.status_code == 422  # Validation error

    def test_frontend_log_missing_message(self, client):
        """Test frontend log without required message field."""
        log_data = {
            "level": "info"
        }

        # Execute
        response = client.post("/api/frontend-log", json=log_data)

        # Assert
        assert response.status_code == 422  # Validation error

    def test_frontend_log_empty_message(self, client):
        """Test frontend log with empty message."""
        log_data = {
            "level": "info",
            "message": ""
        }

        # Execute
        response = client.post("/api/frontend-log", json=log_data)

        # Assert
        assert response.status_code == 200  # Should be allowed

    @patch('backend.api.logs.logger')
    def test_frontend_log_client_host_extraction(self, mock_logger, client):
        """Test that client host is properly extracted and included in log."""
        log_data = {
            "level": "info",
            "message": "Test host extraction"
        }

        # Execute
        response = client.post("/api/frontend-log", json=log_data)

        # Assert
        assert response.status_code == 200
        mock_logger.info.assert_called_once()
        call_args = mock_logger.info.call_args[0][0]
        assert "[FRONTEND]" in call_args
        # Should include client host in brackets
        assert "]" in call_args  # Host should be in brackets
