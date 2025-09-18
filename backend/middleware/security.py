"""
Security middleware for FastAPI backend.
Adds security headers to all responses to protect against common web vulnerabilities.
"""
import os
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware that adds security headers to all HTTP responses.
    
    Headers added:
    - X-Content-Type-Options: Prevents MIME type sniffing
    - X-Frame-Options: Prevents clickjacking attacks
    - X-XSS-Protection: Enables XSS filtering (legacy browsers)
    - Referrer-Policy: Controls referrer information
    - Permissions-Policy: Controls browser features
    - Content-Security-Policy: Prevents XSS and data injection attacks
    """
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.is_development = os.environ.get("ENVIRONMENT") != "production"
    
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        
        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # Prevent clickjacking attacks
        response.headers["X-Frame-Options"] = "DENY"
        
        # Enable XSS filtering (for legacy browsers)
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # Control referrer information
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Control browser features
        response.headers["Permissions-Policy"] = (
            "camera=(), "
            "microphone=(), "
            "geolocation=(), "
            "interest-cohort=()"
        )
        
        # Content Security Policy
        # More permissive in development, strict in production
        if self.is_development:
            csp = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: blob:; "
                "font-src 'self'; "
                "connect-src 'self'; "
                "media-src 'self'; "
                "object-src 'none'; "
                "child-src 'none'; "
                "worker-src 'self'; "
                "frame-ancestors 'none'; "
                "form-action 'self'; "
                "base-uri 'self'"
            )
        else:
            # Production CSP - more restrictive
            csp = (
                "default-src 'self'; "
                "script-src 'self'; "
                "style-src 'self'; "
                "img-src 'self' data:; "
                "font-src 'self'; "
                "connect-src 'self'; "
                "media-src 'self'; "
                "object-src 'none'; "
                "child-src 'none'; "
                "worker-src 'self'; "
                "frame-ancestors 'none'; "
                "form-action 'self'; "
                "base-uri 'self'; "
                "upgrade-insecure-requests"
            )
        
        response.headers["Content-Security-Policy"] = csp
        
        # HSTS (HTTP Strict Transport Security) - only in production with HTTPS
        if not self.is_development:
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains; preload"
            )
        
        return response