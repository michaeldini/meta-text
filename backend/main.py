from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Session, create_engine, select
import os
import json

from openai import OpenAI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), "database.sqlite")
engine = create_engine(f"sqlite:///{DB_PATH}", echo=False)

class Documents(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    label: str = Field(index=True, unique=True)
    content: str

class SplitDocuments(SQLModel, table=True):
    name: str = Field(primary_key=True)
    content: str

def init_db():
    SQLModel.metadata.create_all(engine)

init_db()

def get_session():
    with Session(engine) as session:
        yield session

@app.post("/api/save-text")
async def save_text(label: str = Form(...), file: UploadFile = File(...), session: Session = Depends(get_session)):
    content = (await file.read()).decode("utf-8")
    doc = Documents(label=label, content=content)
    session.add(doc)
    try:
        session.commit()
        session.refresh(doc)
        return {"success": True, "id": doc.id}
    except Exception as e:
        session.rollback()
        if 'UNIQUE constraint failed' in str(e):
            raise HTTPException(status_code=409, detail="Label already exists.")
        raise HTTPException(status_code=500, detail="Failed to save to database.")

@app.get("/api/list-texts")
def list_texts(session: Session = Depends(get_session)):
    docs = session.exec(select(Documents.label)).all()
    return {"texts": docs}

@app.get("/api/get-text/{label}")
def get_text(label: str, session: Session = Depends(get_session)):
    doc = session.exec(select(Documents).where(Documents.label == label)).first()
    if doc:
        return {"label": doc.label, "content": doc.content}
    else:
        raise HTTPException(status_code=404, detail="Text not found.")

@app.delete("/api/delete-text/{label}")
def delete_text(label: str, session: Session = Depends(get_session)):
    doc = session.exec(select(Documents).where(Documents.label == label)).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Text not found.")
    session.delete(doc)
    session.commit()
    return JSONResponse(content=None, status_code=204)

@app.post("/api/create-split-document")
async def create_split_document(request: Request, session: Session = Depends(get_session)):
    body = await request.json()
    source_label = body.get("sourceLabel")
    new_label = body.get("newLabel")
    if not source_label or not new_label:
        raise HTTPException(status_code=400, detail="Missing sourceLabel or newLabel.")
    doc = session.exec(select(Documents).where(Documents.label == source_label)).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Source document not found.")
    # Wrap the initial content in a section object with meta-data fields
    initial_section = {
        "content": doc.content,
        "notes": "",
        "summary": "",
        "aiSummary": "",
        "aiImageUrl": ""
    }
    content_json = json.dumps([initial_section])
    split_doc = SplitDocuments(name=new_label, content=content_json)
    session.add(split_doc)
    try:
        session.commit()
        return {"success": True, "name": new_label}
    except Exception as e:
        session.rollback()
        if 'UNIQUE constraint failed' in str(e):
            raise HTTPException(status_code=409, detail="Split document name already exists.")
        raise HTTPException(status_code=500, detail="Failed to create split document.")

@app.get("/api/list-split-documents")
def list_split_documents(session: Session = Depends(get_session)):
    names = session.exec(select(SplitDocuments.name)).all()
    return {"split_documents": names}

@app.get("/api/get-split-document/{name}")
def get_split_document(name: str, session: Session = Depends(get_session)):
    split_doc = session.get(SplitDocuments, name)
    if split_doc:
        try:
            sections = json.loads(split_doc.content)
            if not isinstance(sections, list):
                sections = [str(split_doc.content)]
        except Exception:
            sections = [str(split_doc.content)]
        return {"name": name, "sections": sections}
    else:
        raise HTTPException(status_code=404, detail="Split document not found.")

@app.delete("/api/delete-split-document/{name}")
def delete_split_document(name: str, session: Session = Depends(get_session)):
    split_doc = session.get(SplitDocuments, name)
    if not split_doc:
        raise HTTPException(status_code=404, detail="Split document not found.")
    session.delete(split_doc)
    session.commit()
    return JSONResponse(content=None, status_code=204)

@app.post("/api/update-split-document/{name}")
async def update_split_document(name: str, request: Request, session: Session = Depends(get_session)):
    body = await request.json()
    if not body:
        raise HTTPException(status_code=400, detail="No data provided.")
    split_doc = session.get(SplitDocuments, name)
    if not split_doc:
        raise HTTPException(status_code=404, detail="Split document not found.")
    split_doc.content = body
    session.add(split_doc)
    session.commit()
    return {"success": True}

@app.post("/api/save-split-document")
async def save_split_document(request: Request, session: Session = Depends(get_session)):
    body = await request.json()
    name = body.get("name")
    sections = body.get("sections")
    if not name or not isinstance(sections, list):
        raise HTTPException(status_code=400, detail="Missing or invalid name or sections.")
    content_json = json.dumps(sections)
    split_doc = session.get(SplitDocuments, name)
    if split_doc:
        split_doc.content = content_json
        session.add(split_doc)
    else:
        split_doc = SplitDocuments(name=name, content=content_json)
        session.add(split_doc)
    session.commit()
    return {"success": True}

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

@app.post("/api/ai-complete")
async def summarize_prompt(request: Request):
    body = await request.json()
    prompt = body.get("prompt")
    if not prompt:
        raise HTTPException(status_code=400, detail="Missing prompt.")
    try:
                
        response = client.responses.create(
            model="gpt-4o-mini-2024-07-18",
            instructions="Write a helpful and extremely concise one sentence summary.",
            input=prompt,
            max_output_tokens=1024,
        )

        ai_text = response.output_text
        return {"result": ai_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Text Storage API. Use /docs for Swagger UI."}
