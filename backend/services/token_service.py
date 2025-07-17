# """Token service for JWT creation, decoding, and related helpers."""
# from datetime import datetime, timedelta, timezone
# from fastapi import Response
# import jwt
# from loguru import logger

# class TokenService:
#     def __init__(self, secret_key: str, algorithm: str, access_token_expiry: int, refresh_token_expiry: int):
#         self.secret_key = secret_key
#         self.algorithm = algorithm
#         self.access_token_expiry = access_token_expiry
#         self.refresh_token_expiry = refresh_token_expiry

#     def create_access_token(self, data: dict, expires_delta: timedelta | None = None):
#         to_encode = data.copy()
#         if expires_delta:
#             expire = datetime.now(timezone.utc) + expires_delta
#         else:
#             expire = datetime.now(timezone.utc) + timedelta(minutes=15)
#         to_encode.update({"exp": expire})
#         encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
#         return encoded_jwt

#     def create_refresh_token(self, data: dict, expires_delta: timedelta | None = None):
#         to_encode = data.copy()
#         if expires_delta:
#             expire = datetime.now(timezone.utc) + expires_delta
#         else:
#             expire = datetime.now(timezone.utc) + timedelta(days=self.refresh_token_expiry)
#         to_encode.update({"exp": expire, "type": "refresh"})
#         encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
#         return encoded_jwt

#     def decode_jwt_and_get_user_id(self, token: str) -> str:
#         """
#         Decode a JWT token and extract the user_id (sub).
#         Raises InvalidTokenError if invalid or missing sub.
#         """
#         from backend.exceptions.auth_exceptions import InvalidTokenError
#         try:
#             payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
#             user_id = payload.get("sub")
#             if user_id is None:
#                 logger.warning("Token missing user_id (sub)")
#                 raise InvalidTokenError("Token missing user_id (sub)")
#             return user_id
#         except Exception as e:
#             logger.warning(f"JWTError during token validation: {e}")
#             raise InvalidTokenError(str(e))

#     def get_access_token_expires(self) -> timedelta:
#         return timedelta(minutes=self.access_token_expiry)

#     def get_refresh_token_expires(self) -> timedelta:
#         return timedelta(days=self.refresh_token_expiry)

#     def set_refresh_token_cookie(self, response: Response, refresh_token: str, refresh_token_expires: timedelta):
#         """Set the refresh token as an httpOnly cookie on the response."""
#         response.set_cookie(
#             key="refresh_token",
#             value=refresh_token,
#             httponly=True,
#             max_age=int(refresh_token_expires.total_seconds()),
#             expires=int(refresh_token_expires.total_seconds()),
#             samesite="lax",
#             secure=False  # Set to True in production with HTTPS
#         )

#     def generate_tokens(self, user, access_token_expires: timedelta, refresh_token_expires: timedelta):
#         """Generate access and refresh tokens for a user."""
#         access_token = self.create_access_token(
#             data={"sub": str(user.id)}, expires_delta=access_token_expires
#         )
#         refresh_token = self.create_refresh_token(
#             data={"sub": str(user.id)}, expires_delta=refresh_token_expires
#         )
#         return access_token, refresh_token
