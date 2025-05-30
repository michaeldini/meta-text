from fastapi import APIRouter, Depends, HTTPException, Request, Form, File, UploadFile
from sqlmodel import select
from backend.models import Documents, SplitDocuments
from backend.db import get_session
import json

router = APIRouter()

# --- Source Documents (was: Texts) ---
@router.post("/source-documents", name="create_source_document")
async def create_source_document(label: str = Form(...), file: UploadFile = File(...), session=Depends(get_session)):
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

@router.get("/source-documents", name="list_source_documents")
def list_source_documents(session=Depends(get_session)):
    docs = session.exec(select(Documents)).all()
    return {"source_documents": docs}

@router.get("/source-documents/{label}", name="get_source_document")
def get_source_document(label: str, session=Depends(get_session)):
    doc = session.exec(select(Documents).where(Documents.label == label)).first()
    if doc:
        return {"label": doc.label, "content": doc.content}
    else:
        raise HTTPException(status_code=404, detail="Source document not found.")

@router.delete("/source-documents/{label}", name="delete_source_document")
def delete_source_document(label: str, session=Depends(get_session)):
    doc = session.exec(select(Documents).where(Documents.label == label)).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Source document not found.")
    session.delete(doc)
    session.commit()
    return None

# --- Meta-Text ---
@router.post("/meta-text", name="create_meta_text")
async def create_meta_text(request: Request, session=Depends(get_session)):
    body = await request.json()
    source_label = body.get("sourceLabel")
    new_label = body.get("newLabel")
    if not source_label or not new_label:
        raise HTTPException(status_code=400, detail="Missing sourceLabel or newLabel.")
    doc = session.exec(select(Documents).where(Documents.label == source_label)).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Source document not found.")
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
            raise HTTPException(status_code=409, detail="Meta-text name already exists.")
        raise HTTPException(status_code=500, detail="Failed to create meta-text.")

@router.get("/meta-text", name="list_meta_texts")
def list_meta_texts(session=Depends(get_session)):
    names = session.exec(select(SplitDocuments.name)).all()
    return {"meta_texts": names}

@router.get("/meta-text/{name}", name="get_meta_text")
def get_meta_text(name: str, session=Depends(get_session)):
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
        raise HTTPException(status_code=404, detail="Meta-text not found.")

@router.delete("/meta-text/{name}", name="delete_meta_text")
def delete_meta_text(name: str, session=Depends(get_session)):
    split_doc = session.get(SplitDocuments, name)
    if not split_doc:
        raise HTTPException(status_code=404, detail="Meta-text not found.")
    session.delete(split_doc)
    session.commit()
    return None

@router.put("/meta-text/{name}", name="update_meta_text")
async def update_meta_text(name: str, request: Request, session=Depends(get_session)):
    body = await request.json()
    if not body:
        raise HTTPException(status_code=400, detail="No data provided.")
    split_doc = session.get(SplitDocuments, name)
    if not split_doc:
        raise HTTPException(status_code=404, detail="Meta-text not found.")
    split_doc.content = body
    session.add(split_doc)
    session.commit()
    return {"success": True}

@router.post("/meta-text/save", name="save_meta_text")
async def save_meta_text(request: Request, session=Depends(get_session)):
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
