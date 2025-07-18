# Auth Readme

## Auth Flow

POST /auth/register: Accepts UserCreate, returns UserRead.

POST /auth/login: Accepts LoginRequest, returns Token, sets refresh token cookie.

POST /auth/refresh: Uses refresh token from cookie, returns new Token, sets new refresh token cookie.

POST /auth/logout: Clears refresh token cookie.

GET /auth/me: Returns UserRead for the current user (JWT required).

## Security & Best Practices

Always hash passwords before storing.
Use httpOnly cookies for refresh tokens.
Set secure=True for cookies in production.
Validate JWTs on every request needing authentication.
Never expose password hashes or sensitive info in responses.

## Review

Backend (auth.py)
/auth/login: Accepts JSON {username, password} and returns access/refresh tokens.
/auth/refresh: Uses the httpOnly refresh token cookie to issue a new access token (and refresh token).
/auth/logout: Clears the refresh token cookie.
/auth/me: Returns user info if a valid access token is provided in the Authorization header.
Refresh token lifetime: Controlled by backend config (7 days), matching your requirement.
Frontend (authService.ts and authStore.ts)
login: Calls /auth/login with JSON, stores access token, fetches user info.
refreshToken: Calls /auth/refresh, updates access token and user info in Zustand.
logout: Calls /auth/logout and clears local state.
getMe: Fetches user info using the access token.
Zustand store: Handles login, registration, silent refresh, logout, and error state.
Persistence: User and token are persisted in local storage for session continuity.
