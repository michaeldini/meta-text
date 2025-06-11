# Tests for backend/api/logs.py
from fastapi import status
from fastapi.testclient import TestClient

def test_frontend_log_levels(client: TestClient):
    for level in ["info", "warn", "error", "debug", "other"]:
        response = client.post("/api/frontend-log", json={"level": level, "message": f"Test {level} log", "context": {"foo": "bar"}})
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "ok"


def test_frontend_log_missing_context(client: TestClient):
    response = client.post("/api/frontend-log", json={"level": "info", "message": "No context"})
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "ok"


def test_frontend_log_missing_level(client: TestClient):
    # Should fail validation (level is required)
    response = client.post("/api/frontend-log", json={"message": "No level provided", "context": {}})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_frontend_log_missing_message(client: TestClient):
    # Should fail validation (message is required)
    response = client.post("/api/frontend-log", json={"level": "info"})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
