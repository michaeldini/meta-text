"""
Test suite for backend/api/auth.py authentication endpoints.
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
        return {"access_token": "dummy-access", "token_type": "bearer"}
    def get_user_by_username(self, username, session):
        return UserRead(id=1, username=username)
    def get_access_token_expires(self):
        return 3600
    def get_refresh_token_expires(self):
        return 7200
    def generate_tokens(self, user, access_exp, refresh_exp):
        return ("dummy-access", "dummy-refresh")
    def set_refresh_token_cookie(self, response: Response, token, expires):
        response.set_cookie(key="refresh_token", value=token)
    def refresh_access_token(self, refresh_token, session):
        return (UserRead(id=1, username="testuser"), "new-access", "new-refresh", 7200)

def override_get_auth_service():
    return DummyAuthService()

def override_get_session():
    return None

def override_get_current_active_user():
    return UserRead(id=1, username="testuser")

@pytest.fixture
def client():
    app = FastAPI()
    app.include_router(auth.router)
    app.dependency_overrides[auth.get_auth_service] = override_get_auth_service
    app.dependency_overrides[auth.get_session] = override_get_session
    app.dependency_overrides[auth.get_current_active_user] = override_get_current_active_user
    return TestClient(app)

def test_register(client):
    resp = client.post("/auth/register", json={"username": "alice", "password": "pw"})
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json()["username"] == "alice"

def test_login(client):
    resp = client.post("/auth/token", data={"username": "alice", "password": "pw"})
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json()["access_token"] == "dummy-access"
    assert resp.json()["token_type"] == "bearer"

def test_refresh_token(client):
    cookies = {"refresh_token": "dummy-refresh"}
    resp = client.post("/auth/refresh", cookies=cookies)
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json()["access_token"] == "new-access"
    assert resp.json()["token_type"] == "bearer"

def test_me(client):
    resp = client.get("/auth/me")
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json()["username"] == "testuser"
