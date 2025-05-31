from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from backend.models import MetaText, SourceDocument
from backend.db import get_session
from backend.api.schemas.meta_text import (
    SectionSchema, CreateMetaTextRequest, MetaTextResponse, MetaTextListResponse, MetaTextListItem
)
from typing import List
import json

router = APIRouter()

@router.post("/meta-text", response_model=dict, name="create_meta_text")
async def create_meta_text(
    req: CreateMetaTextRequest, session=Depends(get_session)
):
    """Create a new meta-text from a source document."""
    doc = session.exec(select(SourceDocument).where(SourceDocument.title == req.sourceTitle)).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Source document not found.")
    initial_section = SectionSchema(content=doc.text)
    content_json = json.dumps([initial_section.dict()])
    meta_text = MetaText(title=req.newTitle, source_document_id=doc.id, content=content_json, text=doc.text)
    session.add(meta_text)
    try:
        session.commit()
        session.refresh(meta_text)
        return {"success": True, "id": meta_text.id, "title": req.newTitle}
    except Exception as e:
        session.rollback()
        if 'UNIQUE constraint failed' in str(e):
            raise HTTPException(status_code=409, detail="Meta-text title already exists.")
        raise HTTPException(status_code=500, detail="Failed to create meta-text.")

@router.get("/meta-text", response_model=MetaTextListResponse, name="list_meta_texts")
def list_meta_texts(session=Depends(get_session)):
    """List all meta-texts with id and title."""
    meta_texts = session.exec(select(MetaText)).all()
    return MetaTextListResponse(meta_texts=[MetaTextListItem(id=m.id, title=m.title) for m in meta_texts])

@router.get("/meta-text/{meta_text_id}", response_model=MetaTextResponse, name="get_meta_text")
def get_meta_text(meta_text_id: int, session=Depends(get_session)):
    """Get a meta-text by id."""
    meta_text = session.get(MetaText, meta_text_id)
    if meta_text:
        try:
            sections = json.loads(meta_text.content)
            if not isinstance(sections, list):
                sections = [str(meta_text.content)]
        except Exception:
            sections = [str(meta_text.content)]
        section_objs = [SectionSchema(**s) if isinstance(s, dict) else SectionSchema(content=str(s)) for s in sections]
        return MetaTextResponse(id=meta_text.id, title=meta_text.title, content=section_objs)
    else:
        raise HTTPException(status_code=404, detail="Meta-text not found.")

@router.delete("/meta-text/{meta_text_id}", response_model=dict, name="delete_meta_text")
def delete_meta_text(meta_text_id: int, session=Depends(get_session)):
    """Delete a meta-text by id."""
    meta_text = session.get(MetaText, meta_text_id)
    if not meta_text:
        raise HTTPException(status_code=404, detail="Meta-text not found.")
    session.delete(meta_text)
    session.commit()
    return {"success": True}

@router.put("/meta-text/{meta_text_id}", response_model=dict, name="update_meta_text")
async def update_meta_text(meta_text_id: int, req: List[SectionSchema], session=Depends(get_session)):
    """Update the sections of a meta-text by id."""
    meta_text = session.get(MetaText, meta_text_id)
    if not meta_text:
        raise HTTPException(status_code=404, detail="Meta-text not found.")
    meta_text.content = json.dumps([s.dict() for s in req])
    session.add(meta_text)
    session.commit()
    return {"success": True}
