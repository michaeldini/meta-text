import backend.env_setup  # loads .env if present
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.db import init_db
from backend.api import ai, source_documents, meta_text, chunks, auth

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

@app.get("/")
def read_root():
    return {"message": "Welcome to the Text Storage API. Use /docs for Swagger UI."}
