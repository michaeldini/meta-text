"""
Test suite for backend/api/auth.py authentication endpoints (new architecture).
Uses FastAPI TestClient and dependency overrides for isolated testing.
"""
import pytest
from fastapi.testclient import TestClient
from fastapi import status, FastAPI, Response
from backend.api import auth
from backend.services.schemas import UserRead

# Dummy AuthService for dependency override
class DummyAuthService:
    def register_user(self, username, password, session):
        return UserRead(id=1, username=username)
    def login_user(self, username, password, session):
        # Simulate backend Token response
        class DummyTokens:
            access_token = "dummy-access"
            refresh_token = "dummy-refresh"
            refresh_token_expires = 604800
        return DummyTokens()
    def get_access_token_expires(self):
        from datetime import timedelta
        return timedelta(minutes=30)
    def get_refresh_token_expires(self):
        from datetime import timedelta
        return timedelta(days=7)
    def set_access_token_cookie(self, response: Response, token, expires):
        response.set_cookie(key="access_token", value=token)
    def set_refresh_token_cookie(self, response: Response, token, expires):
        response.set_cookie(key="refresh_token", value=token)
    def refresh_access_token(self, refresh_token, session):
        return (UserRead(id=1, username="testuser"), "new-access", "new-refresh", 604800)
    def get_user_by_username(self, username, session):
        return UserRead(id=1, username=username)
    def get_user_from_access_token(self, token, session):
        # Simulate extracting user from access token
        return UserRead(id=1, username="testuser")

def override_get_auth_service():
    return DummyAuthService()

def override_get_session():
    return None


@pytest.fixture
def client():
    app = FastAPI()
    app.include_router(auth.router)
    app.dependency_overrides[auth.get_auth_service] = override_get_auth_service
    app.dependency_overrides[auth.get_session] = override_get_session
    return TestClient(app)

def test_register(client):
    resp = client.post("/auth/register", json={"username": "alice", "password": "pw"})
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json()["username"] == "alice"

def test_login(client):
    resp = client.post("/auth/login", json={"username": "alice", "password": "pw"})
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json()["message"] == "Login successful"
    assert resp.json()["token_type"] == "bearer"

def test_refresh_token(client):
    cookies = {"refresh_token": "dummy-refresh"}
    resp = client.post("/auth/refresh", cookies=cookies)
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json()["message"] == "Token refreshed successfully"
    assert resp.json()["token_type"] == "bearer"

def test_me(client):
    # Simulate access token cookie
    cookies = {"access_token": "dummy-access"}
    resp = client.get("/auth/me", cookies=cookies)
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json()["username"] == "testuser"
