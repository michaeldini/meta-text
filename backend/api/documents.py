from fastapi import APIRouter, Depends, HTTPException, Request, Form, File, UploadFile
from sqlmodel import select
from backend.models import SourceDocument, MetaText
from backend.db import get_session
import json

router = APIRouter()

# --- Source Documents (was: Texts) ---
@router.post("/source-documents", name="create_source_document")
async def create_source_document(title: str = Form(...), file: UploadFile = File(...), session=Depends(get_session)):
    text = (await file.read()).decode("utf-8")
    doc = SourceDocument(title=title, text=text)
    session.add(doc)
    try:
        session.commit()
        session.refresh(doc)
        return {"success": True, "id": doc.id}
    except Exception as e:
        session.rollback()
        if 'UNIQUE constraint failed' in str(e):
            raise HTTPException(status_code=409, detail="Title already exists.")
        raise HTTPException(status_code=500, detail="Failed to save to database.")

@router.get("/source-documents", name="list_source_documents")
def list_source_documents(full: bool = False, session=Depends(get_session)):
    if full:
        docs = session.exec(select(SourceDocument)).all()
        return {"source_documents": [{"title": d.title, "text": d.text} for d in docs]}
    else:
        docs = session.exec(select(SourceDocument.title)).all()
        return {"source_documents": docs}
    
@router.get("/source-documents-with-details", name="list_source_documents_with_details")
def list_source_documents_with_details(session=Depends(get_session)):
    docs = session.exec(select(SourceDocument)).all()
    result = []
    for doc in docs:
        details = {
            "title": doc.title,
            "text": doc.text,
            "details": {
                "summary": "",
                "characters": [],
                "locations": [],
                "themes": [],
                "symbols": []
            }
        }
        if doc.details:
            details["details"]["summary"] = doc.details.summary
            details["details"]["characters"] = json.loads(doc.details.characters) if doc.details.characters else []
            details["details"]["locations"] = json.loads(doc.details.locations) if doc.details.locations else []
            details["details"]["themes"] = json.loads(doc.details.themes) if doc.details.themes else []
            details["details"]["symbols"] = json.loads(doc.details.symbols) if doc.details.symbols else []
        result.append(details)
    return {"source_documents": result}


@router.get("/source-documents/{title}", name="get_source_document")
def get_source_document(title: str, session=Depends(get_session)):
    doc = session.exec(select(SourceDocument).where(SourceDocument.title == title)).first()
    if doc:
        return {"title": doc.title, "text": doc.text}
    else:
        raise HTTPException(status_code=404, detail="Source document not found.")

@router.delete("/source-documents/{title}", name="delete_source_document")
def delete_source_document(title: str, session=Depends(get_session)):
    doc = session.exec(select(SourceDocument).where(SourceDocument.title == title)).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Source document not found.")
    session.delete(doc)
    session.commit()
    return None

# --- Meta-Text ---
@router.post("/meta-text", name="create_meta_text")
async def create_meta_text(request: Request, session=Depends(get_session)):
    body = await request.json()
    source_title = body.get("sourceTitle")
    new_title = body.get("newTitle")
    if not source_title or not new_title:
        raise HTTPException(status_code=400, detail="Missing sourceTitle or newTitle.")
    doc = session.exec(select(SourceDocument).where(SourceDocument.title == source_title)).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Source document not found.")
    initial_section = {
        "content": doc.text,
        "notes": "",
        "summary": "",
        "aiSummary": "",
        "aiImageUrl": ""
    }
    content_json = json.dumps([initial_section])
    meta_text = MetaText(title=new_title, source_document_id=doc.id, content=content_json)
    session.add(meta_text)
    try:
        session.commit()
        return {"success": True, "title": new_title}
    except Exception as e:
        session.rollback()
        if 'UNIQUE constraint failed' in str(e):
            raise HTTPException(status_code=409, detail="Meta-text title already exists.")
        raise HTTPException(status_code=500, detail="Failed to create meta-text.")

@router.get("/meta-text", name="list_meta_texts")
def list_meta_texts(session=Depends(get_session)):
    titles = session.exec(select(MetaText.title)).all()
    return {"meta_texts": titles}

@router.get("/meta-text/{title}", name="get_meta_text")
def get_meta_text(title: str, session=Depends(get_session)):
    meta_text = session.exec(select(MetaText).where(MetaText.title == title)).first()
    if meta_text:
        try:
            sections = json.loads(meta_text.content)
            if not isinstance(sections, list):
                sections = [str(meta_text.content)]
        except Exception:
            sections = [str(meta_text.content)]
        return {"title": title, "content": sections}
    else:
        raise HTTPException(status_code=404, detail="Meta-text not found.")

@router.delete("/meta-text/{title}", name="delete_meta_text")
def delete_meta_text(title: str, session=Depends(get_session)):
    meta_text = session.exec(select(MetaText).where(MetaText.title == title)).first()
    if not meta_text:
        raise HTTPException(status_code=404, detail="Meta-text not found.")
    session.delete(meta_text)
    session.commit()
    return None

@router.put("/meta-text/{title}", name="update_meta_text")
async def update_meta_text(title: str, request: Request, session=Depends(get_session)):
    body = await request.json()
    if not body:
        raise HTTPException(status_code=400, detail="No data provided.")
    meta_text = session.exec(select(MetaText).where(MetaText.title == title)).first()
    if not meta_text:
        raise HTTPException(status_code=404, detail="Meta-text not found.")
    meta_text.content = body
    session.add(meta_text)
    session.commit()
    return {"success": True}

@router.post("/meta-text/save", name="save_meta_text")
async def save_meta_text(request: Request, session=Depends(get_session)):
    body = await request.json()
    title = body.get("title")
    sections = body.get("sections")
    if not title or not isinstance(sections, list):
        raise HTTPException(status_code=400, detail="Missing or invalid title or sections.")
    content_json = json.dumps(sections)
    meta_text = session.exec(select(MetaText).where(MetaText.title == title)).first()
    if meta_text:
        meta_text.content = content_json
        session.add(meta_text)
    else:
        raise HTTPException(status_code=404, detail="Meta-text not found.")
    session.commit()
    return {"success": True}
