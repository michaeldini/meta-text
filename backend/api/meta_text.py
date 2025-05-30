from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import select
from backend.models import MetaText, SourceDocument
from backend.db import get_session
import json

router = APIRouter()

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
    meta_text.content = json.dumps(body)  # Ensure content is stored as JSON string
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
