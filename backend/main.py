import os

from loguru import logger
import backend.env_setup  # noqa: F401
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.db import init_db
from backend.api import ai, chunk, explanation, metatext, rewrite, source_documents, auth, logs, bookmark, user_config
from backend.exceptions.auth_exceptions import (
    InvalidCredentialsError,
    UserRegistrationError,
    UsernameAlreadyExistsError,
    InvalidTokenError,
    TokenMissingUserIdError,
    UserNotFoundError,
)



# Initialize logger
logger.add("backend/logs/app.log", rotation="1 MB", level="INFO", backtrace=True, diagnose=True)
# Ensure the logs directory exists
if not os.path.exists("backend/logs"):
    os.makedirs("backend/logs")
# Ensure the public directory exists for static files
if not os.path.exists("public/generated_images"):
    os.makedirs("public/generated_images")

# FastAPI application setup
app = FastAPI()



# Global exception handlers
@app.exception_handler(UsernameAlreadyExistsError)
async def username_already_exists_handler(request: Request, exc: UsernameAlreadyExistsError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )

@app.exception_handler(UserRegistrationError)
async def user_registration_error_handler(request: Request, exc: UserRegistrationError):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": str(exc)},
    )

@app.exception_handler(InvalidTokenError)
async def invalid_token_error_handler(request: Request, exc: InvalidTokenError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": str(exc)},
    )

@app.exception_handler(TokenMissingUserIdError)
async def token_missing_user_id_error_handler(request: Request, exc: TokenMissingUserIdError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": str(exc)},
    )

@app.exception_handler(UserNotFoundError)
async def user_not_found_error_handler(request: Request, exc: UserNotFoundError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": str(exc)},
    )
    
@app.exception_handler(InvalidCredentialsError)
async def invalid_credentials_error_handler(request: Request, exc: InvalidCredentialsError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": "Invalid username or password"},
        headers={"WWW-Authenticate": "Bearer"},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(source_documents.router, prefix="/api", tags=["source_documents"])
app.include_router(metatext.router, prefix="/api", tags=["meta_text"])
app.include_router(chunk.router, prefix="/api", tags=["chunks"])
app.include_router(ai.router, prefix="/api", tags=["ai"])
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(explanation.router, prefix="/api", tags=["review"])
app.include_router(logs.router, prefix="/api", tags=["logs"])
app.include_router(rewrite.router, prefix="/api", tags=["chunk_compressions"])
app.include_router(bookmark.router, prefix="/api", tags=["bookmarks"])
app.include_router(user_config.router, prefix="/api", tags=["user_config"])
# app.include_router(explain.router, prefix="/api", tags=["explain"])

# Mount static files for generated images
public_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../public'))
app.mount("/generated_images", StaticFiles(directory=os.path.join(public_dir, "generated_images")), name="generated_images")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Text Storage API. Use /docs for Swagger UI."}
