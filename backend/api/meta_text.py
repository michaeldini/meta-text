from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, Session
from backend.db import get_session
from backend.models import (
     CreateMetaTextRequest, MetaTextRead,  MetaText, SourceDocument
)
from backend.models import Chunk  # Needed for chunk creation in create_meta_text


router = APIRouter()


@router.post("/meta-text", name="create_meta_text")
async def create_meta_text(req: CreateMetaTextRequest, session: Session = Depends(get_session)) -> dict:
    """Create a new meta-text from a source document."""
    # get the source document from which to create the meta-text
    doc = session.exec(select(SourceDocument).where(SourceDocument.id == req.sourceDocId)).first()
    # if the source document does not exist, raise an error
    if not doc:
        raise HTTPException(status_code=404, detail="Source document not found.")
    try:
        # add the meta-text to the database
        meta_text = MetaText(title=req.title, source_document_id=doc.id, text=doc.text)
        session.add(meta_text)
        session.flush()  # Assigns meta_text.id without committing

        # break the text into 500-word chunks and add all to the database
        words = doc.text.split()
        chunk_size = 500
        num_chunks = (len(words) + chunk_size - 1) // chunk_size
        for i in range(num_chunks):
            chunk_words = words[i * chunk_size:(i + 1) * chunk_size]
            chunk_text = ' '.join(chunk_words)
            chunk = Chunk(
                text=chunk_text,
                position=float(i),
                meta_text_id=meta_text.id
            )
            session.add(chunk)
        session.commit()
        session.refresh(meta_text)
        # Optionally, refresh all chunks if needed
        return {"success": True, "id": meta_text.id, "title": req.title}
    except Exception as e:
        session.rollback()
        if 'UNIQUE constraint failed' in str(e):
            raise HTTPException(status_code=409, detail="Meta-text title already exists.")
        raise HTTPException(status_code=500, detail="Failed to create meta-text.")

@router.get("/meta-text", name="list_meta_texts")
def list_meta_texts(session: Session = Depends(get_session)) -> list[MetaTextRead]:
    """List all meta-texts."""
    meta_texts = session.exec(select(MetaText)).all()
    return meta_texts   # type: ignore

@router.get("/meta-text/{meta_text_id}", name="get_meta_text")
def get_meta_text(meta_text_id: int, session: Session = Depends(get_session)) -> MetaTextRead:
    meta_text = session.exec(
        select(MetaText)
        .where(MetaText.id == meta_text_id)
    ).first()
    if not meta_text:
        raise HTTPException(status_code=404, detail="Meta-text not found.")
    return meta_text  # type: ignore

@router.delete("/meta-text/{meta_text_id}", name="delete_meta_text")
def delete_meta_text(meta_text_id: int, session: Session = Depends(get_session)) -> dict:
    meta_text = session.get(MetaText, meta_text_id)
    if not meta_text:
        raise HTTPException(status_code=404, detail="Meta-text not found.")
    title = meta_text.title # Store title for response
    session.delete(meta_text)
    session.commit()
    return {"success": True, "id": meta_text_id, "title": title}
