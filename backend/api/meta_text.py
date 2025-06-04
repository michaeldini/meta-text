from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel import select, Session
from backend.db import get_session
from backend.models import (
     CreateMetaTextRequest, CreateSuccessResponse, GetListResponse, GetResponse, MetaTextResponse,  MetaText, SourceDocument, Chunk
)


router = APIRouter()


@router.post("/meta-text", response_model=CreateSuccessResponse, name="create_meta_text")
async def create_meta_text(req: CreateMetaTextRequest, session: Session = Depends(get_session)):
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

@router.get("/meta-text", response_model=GetListResponse, name="list_meta_texts")
def list_meta_texts(session: Session = Depends(get_session)):
    meta_texts = session.exec(select(MetaText)).all()
    return GetListResponse(
        data=[GetResponse(id=meta_text.id, title=meta_text.title) for meta_text in meta_texts]
    )

@router.get("/meta-text/{meta_text_id}", response_model=MetaTextResponse, name="get_meta_text")
def get_meta_text(meta_text_id: int, session: Session = Depends(get_session)):
    meta_text = session.get(MetaText, meta_text_id)
    if not meta_text:
        raise HTTPException(status_code=404, detail="Meta-text not found.")
    # Fetch all chunks for this meta-text
    chunks = session.exec(
        select(Chunk).where(Chunk.meta_text_id == meta_text.id).order_by(getattr(Chunk, "position"))
    ).all()
    return MetaTextResponse(
        id=meta_text.id,
        title=meta_text.title,
        text=meta_text.text,
        # Return full chunk dicts, not just text
        chunks=[chunk.model_dump() for chunk in chunks],
        source_document_id=meta_text.source_document_id
    )

@router.get("/metatext/{meta_text_id}/chunks")
def get_chunks_api(meta_text_id: int, session: Session = Depends(get_session)):
    chunks = session.exec(
        select(Chunk).where(Chunk.meta_text_id == meta_text_id).order_by(getattr(Chunk, "position"))
    ).all()
    return [chunk.model_dump() for chunk in chunks]

@router.post("/chunk/{chunk_id}/split")
def split_chunk(chunk_id: int, word_index: int, session: Session = Depends(get_session)):
    chunk = session.get(Chunk, chunk_id)
    if not chunk:
        raise HTTPException(status_code=404, detail="Chunk not found")
    words = chunk.text.split()
    if word_index <= 0 or word_index >= len(words):
        raise HTTPException(status_code=400, detail="Invalid split index")
    before = " ".join(words[:word_index])
    after = " ".join(words[word_index:])
    chunk.text = before
    # Find next position
    next_chunk = session.exec(
        select(Chunk)
        .where(
            (Chunk.meta_text_id == chunk.meta_text_id) &
            (Chunk.position > chunk.position)
        )
        .order_by(getattr(Chunk, "position"))
    ).first()
    if next_chunk:
        new_position = (chunk.position + next_chunk.position) / 2
    else:
        new_position = chunk.position + 1
    new_chunk = Chunk(
        text=after,
        position=new_position,
        meta_text_id=chunk.meta_text_id
    )
    session.add(new_chunk)
    session.commit()
    session.refresh(chunk)
    session.refresh(new_chunk)
    return {"chunks": [chunk.model_dump(), new_chunk.model_dump()]}

@router.post("/chunk/combine")
def combine_chunks(first_chunk_id: int, second_chunk_id: int, session: Session = Depends(get_session)):
    first = session.get(Chunk, first_chunk_id)
    second = session.get(Chunk, second_chunk_id)
    if not first or not second:
        raise HTTPException(status_code=404, detail="Chunk(s) not found")
    if first.position > second.position:
        first, second = second, first
    first.text = f"{first.text} {second.text}"
    session.delete(second)
    session.commit()
    session.refresh(first)
    return {"chunk": first.model_dump()}

@router.put("/chunk/{chunk_id}")
def update_chunk(chunk_id: int, chunk_data: dict = Body(...), session: Session = Depends(get_session)):
    chunk = session.get(Chunk, chunk_id)
    if not chunk:
        raise HTTPException(status_code=404, detail="Chunk not found")
    # Update all editable fields
    if 'text' in chunk_data:
        chunk.text = chunk_data['text']
    if 'summary' in chunk_data:
        chunk.summary = chunk_data['summary']
    if 'notes' in chunk_data:
        chunk.notes = chunk_data['notes']
    if 'aiSummary' in chunk_data:
        chunk.aiSummary = chunk_data['aiSummary']
    session.add(chunk)
    session.commit()
    session.refresh(chunk)
    return {"chunk": chunk.model_dump()}
