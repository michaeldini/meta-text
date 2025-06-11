# Tests for backend/api/auth.py
from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session
from backend.models import User

def test_register_success(client: TestClient, session: Session):
    response = client.post("/api/auth/register", json={"username": "alice", "password": "wonderland"})
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["username"] == "alice"
    assert "id" in data


def test_register_duplicate_username(client: TestClient, session: Session):
    client.post("/api/auth/register", json={"username": "bob", "password": "builder"})
    response = client.post("/api/auth/register", json={"username": "bob", "password": "builder2"})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "Username already registered"


def test_login_success(client: TestClient, session: Session):
    client.post("/api/auth/register", json={"username": "carol", "password": "pass123"})
    response = client.post("/api/auth/token", data={"username": "carol", "password": "pass123"}, headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client: TestClient, session: Session):
    client.post("/api/auth/register", json={"username": "dave", "password": "rightpass"})
    response = client.post("/api/auth/token", data={"username": "dave", "password": "wrongpass"}, headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Incorrect username or password"


def test_login_nonexistent_user(client: TestClient):
    response = client.post("/api/auth/token", data={"username": "ghost", "password": "nopass"}, headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Incorrect username or password"


def test_me_success(client: TestClient, session: Session):
    # Register and login
    client.post("/api/auth/register", json={"username": "eve", "password": "secret"})
    login_resp = client.post("/api/auth/token", data={"username": "eve", "password": "secret"}, headers={"Content-Type": "application/x-www-form-urlencoded"})
    token = login_resp.json()["access_token"]
    # Get current user info
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == status.HTTP_200_OK
    data = me_resp.json()
    assert data["username"] == "eve"
    assert "id" in data


def test_me_invalid_token(client: TestClient):
    response = client.get("/api/auth/me", headers={"Authorization": "Bearer invalidtoken"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Could not validate credentials"
