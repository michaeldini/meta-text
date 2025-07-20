# """
# Auth-related FastAPI dependency functions for extracting and validating the current user from a JWT token.
# """
# from fastapi import Depends, HTTPException, status, Header
# from backend.services.auth_service import AuthService
# from backend.db import get_session


# from sqlmodel import Session


# # Dependency to allow injection/mocking of AuthService for testing
# def get_auth_service():
#     return AuthService()

# def get_current_user(
#     authorization: str = Header(None),
#     session: Session = Depends(get_session),
#     auth_service: AuthService = Depends(get_auth_service)
# ):
#     """
#     Dependency to extract and validate the current user from the Authorization header JWT.
#     Returns the user instance or raises HTTPException if invalid.
#     """
#     if not authorization or not authorization.startswith("Bearer "):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Missing or invalid Authorization header",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     token = authorization.split(" ", 1)[1]
#     user = auth_service.get_user_from_access_token(token, session)
#     return user
