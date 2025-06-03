from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.db import init_db
from backend.api import ai, source_documents, meta_text, dictionary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(source_documents.router, prefix="/api")
app.include_router(meta_text.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(dictionary.router, prefix="/api/dictionary", tags=["dictionary"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Text Storage API. Use /docs for Swagger UI."}
