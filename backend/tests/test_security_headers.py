"""
Test suite for security headers middleware.
Verifies that security headers are properly applied to all responses.
"""
import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from backend.middleware import SecurityHeadersMiddleware


def test_security_headers_applied():
    """Test that security headers are properly applied to responses."""
    # Create a minimal FastAPI app with security middleware
    app = FastAPI()
    app.add_middleware(SecurityHeadersMiddleware)
    
    @app.get("/test")
    def test_endpoint():
        return {"message": "test"}
    
    client = TestClient(app)
    response = client.get("/test")
    
    # Check that response is successful
    assert response.status_code == 200
    
    # Check security headers are present
    headers = response.headers
    
    # Basic security headers
    assert "X-Content-Type-Options" in headers
    assert headers["X-Content-Type-Options"] == "nosniff"
    
    assert "X-Frame-Options" in headers
    assert headers["X-Frame-Options"] == "DENY"
    
    assert "X-XSS-Protection" in headers
    assert headers["X-XSS-Protection"] == "1; mode=block"
    
    assert "Referrer-Policy" in headers
    assert headers["Referrer-Policy"] == "strict-origin-when-cross-origin"
    
    assert "Permissions-Policy" in headers
    permissions_policy = headers["Permissions-Policy"]
    assert "camera=()" in permissions_policy
    assert "microphone=()" in permissions_policy
    
    # CSP header
    assert "Content-Security-Policy" in headers
    csp = headers["Content-Security-Policy"]
    assert "default-src 'self'" in csp
    assert "object-src 'none'" in csp
    assert "frame-ancestors 'none'" in csp


def test_security_headers_development_vs_production():
    """Test that CSP differs between development and production."""
    import os
    
    # Test development CSP
    os.environ["ENVIRONMENT"] = "development"
    app_dev = FastAPI()
    app_dev.add_middleware(SecurityHeadersMiddleware)
    
    @app_dev.get("/test")
    def test_endpoint_dev():
        return {"message": "test"}
    
    client_dev = TestClient(app_dev)
    response_dev = client_dev.get("/test")
    
    csp_dev = response_dev.headers["Content-Security-Policy"]
    assert "'unsafe-inline'" in csp_dev  # Development allows unsafe-inline
    assert "upgrade-insecure-requests" not in csp_dev  # Development doesn't upgrade
    
    # Test production CSP
    os.environ["ENVIRONMENT"] = "production"
    app_prod = FastAPI()
    app_prod.add_middleware(SecurityHeadersMiddleware)
    
    @app_prod.get("/test")
    def test_endpoint_prod():
        return {"message": "test"}
    
    client_prod = TestClient(app_prod)
    response_prod = client_prod.get("/test")
    
    csp_prod = response_prod.headers["Content-Security-Policy"]
    assert "'unsafe-inline'" not in csp_prod  # Production doesn't allow unsafe-inline
    assert "upgrade-insecure-requests" in csp_prod  # Production upgrades to HTTPS
    
    # HSTS should be present in production
    assert "Strict-Transport-Security" in response_prod.headers
    hsts = response_prod.headers["Strict-Transport-Security"]
    assert "max-age=31536000" in hsts
    assert "includeSubDomains" in hsts
    
    # Clean up
    if "ENVIRONMENT" in os.environ:
        del os.environ["ENVIRONMENT"]