from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlmodel import select
from backend.models import SourceDocument
from backend.db import get_session
import json

router = APIRouter()

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
