"""
Tests for auth-related FastAPI dependency functions in auth_dependencies.py.
Covers extraction and validation of the current user from JWT tokens.
"""
import pytest
from fastapi import FastAPI, Depends, status, HTTPException
from fastapi.testclient import TestClient
from backend.dependencies import get_current_user
from backend.services.auth_service import AuthService
from sqlmodel import Session

# Dummy user for mocking
class DummyUser:
    def __init__(self, username):
        self.username = username

# Patch AuthService.get_user_from_access_token for tests
def fake_get_user_from_access_token(self, token, session):
    if token == "validtoken":
        return DummyUser("testuser")
    raise HTTPException(status_code=401, detail="Invalid token")

app = FastAPI()

@app.get("/protected")
def protected_route(user=Depends(get_current_user)):
    return {"username": user.username}

@pytest.fixture(autouse=True)
def patch_auth_service(monkeypatch):
    monkeypatch.setattr(AuthService, "get_user_from_access_token", fake_get_user_from_access_token)

@pytest.fixture
def client():
    return TestClient(app)

def test_valid_token(client):
    response = client.get("/protected", cookies={"access_token": "validtoken"})
    assert response.status_code == 200
    assert response.json() == {"username": "testuser"}

def test_missing_authorization_header(client):
    response = client.get("/protected")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Missing access token cookie"

def test_malformed_authorization_header(client):
    response = client.get("/protected", cookies={"access_token": ""})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Missing access token cookie"

def test_invalid_token(client):
    response = client.get("/protected", cookies={"access_token": "badtoken"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Invalid token"
