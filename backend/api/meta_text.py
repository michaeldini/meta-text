from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select, Session
from loguru import logger

from backend.db import get_session
from backend.models import (
     CreateMetaTextRequest, MetaTextRead,  MetaText, SourceDocument
)
from backend.models import Chunk  # Needed for chunk creation in create_meta_text


router = APIRouter()

def initial_split_text_into_chunks(text: str, chunk_size: int = 500) -> list[str]:
    """Initialize a text into a list of chunk_size-word strings."""
    words = text.split()
    return [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

@router.post("/meta-text", response_model=MetaTextRead, name="create_meta_text")
async def create_meta_text(req: CreateMetaTextRequest, session: Session = Depends(get_session)):
    """Create a new meta-text from a source document."""
    logger.info(f"Received request to create meta-text with title: {req.title} from sourceDocId: {req.sourceDocId}")
    doc = session.exec(select(SourceDocument).where(SourceDocument.id == req.sourceDocId)).first()
    # if the source document does not exist, raise an error
    if not doc:
        logger.warning(f"Source document not found for meta-text creation: id={req.sourceDocId}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Source document not found.")
    try:
        # add the meta-text to the database
        meta_text = MetaText(title=req.title, source_document_id=doc.id, text=doc.text)
        session.add(meta_text)
        session.flush()  # Assigns meta_text.id without committing

        # Split text into chunks and add all to the database
        chunk_texts = initial_split_text_into_chunks(doc.text, chunk_size=500)
        logger.info(f"Splitting meta-text into {len(chunk_texts)} chunks of size 500")
        for i, chunk_text in enumerate(chunk_texts):
            chunk = Chunk(
                text=chunk_text,
                position=float(i),
                meta_text_id=meta_text.id
            )
            session.add(chunk)
        session.commit()
        session.refresh(meta_text)
        logger.info(f"Meta-text created successfully: id={meta_text.id}, title={req.title}")
        return meta_text
    
    except Exception as e:
        session.rollback()
        logger.error(f"Error creating meta-text: {e}")
        if 'UNIQUE constraint failed' in str(e):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Meta-text title already exists.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create meta-text.")

@router.get("/meta-text", response_model=list[MetaTextRead], name="list_meta_texts")
def list_meta_texts(session: Session = Depends(get_session)):
    """List all meta-texts."""
    logger.info("Listing all meta-texts")
    meta_texts = session.exec(select(MetaText)).all()
    logger.info(f"Found {len(meta_texts)} meta-texts")
    return meta_texts

@router.get("/meta-text/{meta_text_id}", response_model=MetaTextRead, name="get_meta_text")
def get_meta_text(meta_text_id: int, session: Session = Depends(get_session)):
    logger.info(f"Retrieving meta-text with id: {meta_text_id}")
    meta_text = session.exec(
        select(MetaText)
        .where(MetaText.id == meta_text_id)
    ).first()
    if not meta_text:
        logger.warning(f"Meta-text not found: id={meta_text_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meta-text not found.")
    logger.info(f"Meta-text found: id={meta_text.id}, title={meta_text.title}")
    return meta_text

@router.delete("/meta-text/{meta_text_id}", name="delete_meta_text")
def delete_meta_text(meta_text_id: int, session: Session = Depends(get_session)) -> dict:
    logger.info(f"Attempting to delete meta-text with id: {meta_text_id}")
    meta_text = session.get(MetaText, meta_text_id)
    if not meta_text:
        logger.warning(f"Meta-text not found for deletion: id={meta_text_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meta-text not found.")
    title = meta_text.title # Store title for response
    session.delete(meta_text)
    session.commit()
    logger.info(f"Meta-text deleted successfully: id={meta_text_id}, title={title}")
    return {"success": True, "id": meta_text_id, "title": title}
