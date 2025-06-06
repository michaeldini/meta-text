from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel import select, Session
from typing import List
from backend.db import get_session
from backend.models import Chunk, ChunkRead

router = APIRouter()

@router.get("/chunks/all/{meta_text_id}", name="get_chunks")
def get_chunks_api(meta_text_id: int, session: Session = Depends(get_session)) -> List[ChunkRead]:
    chunks = session.exec(
        select(Chunk).where(Chunk.meta_text_id == meta_text_id).order_by(getattr(Chunk, "position"))
    ).all()
    return chunks # type: ignore

@router.post("/chunk/{chunk_id}/split", name="split_chunk")
def split_chunk(chunk_id: int, word_index: int, session: Session = Depends(get_session)) -> List[ChunkRead]:
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
    return [chunk, new_chunk] # type: ignore

@router.post("/chunk/combine", name="combine_chunks")
def combine_chunks(first_chunk_id: int, second_chunk_id: int, session: Session = Depends(get_session)) -> ChunkRead:
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
    return first # type: ignore

@router.put("/chunk/{chunk_id}", name="update_chunk")
def update_chunk(chunk_id: int, chunk_data: dict = Body(...), session: Session = Depends(get_session)) -> ChunkRead:
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
    return chunk # type: ignore
