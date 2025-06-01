from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlmodel import select
from backend.models import SourceDocument
from backend.db import get_session

router = APIRouter()

@router.post("/source-documents", name="create_source_document")
async def create_source_document(
    title: str = Form(...),
    file: UploadFile = File(...),
    details: str | None = Form(None),
    session=Depends(get_session),
):
    text = (await file.read()).decode("utf-8")
    doc = SourceDocument(title=title, text=text, details=details)
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
    docs = session.exec(select(SourceDocument)).all()
    if full:
        return {"source_documents": [
            {"id": d.id, "title": d.title, "text": d.text, "details": d.details} for d in docs
        ]}
    else:
        return {"source_documents": [
            {"id": d.id, "title": d.title, "details": d.details} for d in docs
        ]}

@router.get("/source-documents/{doc_id}", name="get_source_document")
def get_source_document(doc_id: int, session=Depends(get_session)):
    doc = session.get(SourceDocument, doc_id)
    if doc:
        return {"id": doc.id, "title": doc.title, "text": doc.text, "details": doc.details}
    else:
        raise HTTPException(status_code=404, detail="Source document not found.")

@router.delete("/source-documents/{doc_id}", name="delete_source_document")
def delete_source_document(doc_id: int, session=Depends(get_session)):
    doc = session.get(SourceDocument, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Source document not found.")
    session.delete(doc)
    session.commit()
    return {"success": True}

@router.patch("/source-documents/{doc_id}", name="update_source_document")
def update_source_document(
    doc_id: int,
    title: str | None = Form(None),
    text: str | None = Form(None),
    details: str | None = Form(None),
    session=Depends(get_session),
):
    doc = session.get(SourceDocument, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Source document not found.")
    if title is not None:
        doc.title = title
    if text is not None:
        doc.text = text
    if details is not None:
        doc.details = details
    try:
        session.add(doc)
        session.commit()
        session.refresh(doc)
        return {"success": True, "id": doc.id}
    except Exception as e:
        session.rollback()
        if 'UNIQUE constraint failed' in str(e):
            raise HTTPException(status_code=409, detail="Title already exists.")
        raise HTTPException(status_code=500, detail="Failed to update document.")
