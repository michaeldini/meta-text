import backend.env_setup  # noqa: F401
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.db import init_db
from backend.api import ai, review, source_documents, meta_text, chunks, auth, logs, chunk_compressions, explain
from fastapi.staticfiles import StaticFiles
import os
from loguru import logger

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(source_documents.router, prefix="/api", tags=["source_documents"])
app.include_router(meta_text.router, prefix="/api", tags=["meta_text"])
app.include_router(chunks.router, prefix="/api", tags=["chunks"])
app.include_router(ai.router, prefix="/api", tags=["ai"])
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(review.router, prefix="/api", tags=["review"])
app.include_router(logs.router, prefix="/api", tags=["logs"])
app.include_router(chunk_compressions.router, prefix="/api", tags=["chunk_compressions"])
app.include_router(explain.router, prefix="/api", tags=["explain"])

# Mount static files for generated images
public_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../public'))
app.mount("/generated_images", StaticFiles(directory=os.path.join(public_dir, "generated_images")), name="generated_images")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Text Storage API. Use /docs for Swagger UI."}
