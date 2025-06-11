from fastapi import APIRouter, Depends, HTTPException, Body, status
from sqlmodel import select, Session, desc
from typing import List
from backend.db import get_session
from backend.models import Chunk, ChunkRead, ChunkWithImageRead, AiImage
from loguru import logger


router = APIRouter()

def get_latest_ai_image_for_chunk(session: Session, chunk_id: int):
    """Return the latest AiImage for a given chunk_id, or None if not found."""
    return session.exec(
        select(AiImage).where(AiImage.chunk_id == chunk_id).order_by(desc(AiImage.id))
    ).first()

def split_chunk_text(text: str, word_index: int) -> tuple[str, str]:
    """Split text at word_index into before and after strings."""
    words = text.split()
    before = " ".join(words[:word_index])
    after = " ".join(words[word_index:])
    return before, after

def update_chunk_fields(chunk: Chunk, data: dict):
    for field in ['text', 'summary', 'notes', 'comparison']:
        if field in data:
            setattr(chunk, field, data[field])

@router.get("/chunks/all/{meta_text_id}", response_model=List[ChunkWithImageRead], name="get_chunks")
def get_chunks_api(meta_text_id: int, session: Session = Depends(get_session)):
    logger.info(f"Listing all chunks for meta_text_id: {meta_text_id}")
    chunks = session.exec(
        select(Chunk).where(Chunk.meta_text_id == meta_text_id).order_by(getattr(Chunk, "position"))
    ).all()
    result = []
    for chunk in chunks:
        ai_image = get_latest_ai_image_for_chunk(session, chunk.id)
        result.append(ChunkWithImageRead.model_validate(chunk, update={"ai_image": ai_image}))
    logger.info(f"Found {len(result)} chunks for meta_text_id: {meta_text_id}")
    return result # type: ignore


@router.get("/chunk/{chunk_id}", response_model=ChunkWithImageRead, name="get_chunk")
def get_chunk(chunk_id: int, session: Session = Depends(get_session)):
    logger.info(f"Retrieving chunk with id: {chunk_id}")
    chunk = session.get(Chunk, chunk_id)
    if not chunk:
        logger.warning(f"Chunk not found: id={chunk_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chunk not found")
    ai_image = get_latest_ai_image_for_chunk(session, chunk.id)
    logger.info(f"Chunk found: id={chunk.id}, meta_text_id={chunk.meta_text_id}")
    return ChunkWithImageRead.model_validate(chunk, update={"ai_image": ai_image})


@router.post("/chunk/{chunk_id}/split", response_model=List[ChunkRead], name="split_chunk")
def split_chunk(chunk_id: int, word_index: int, session: Session = Depends(get_session)):
    logger.info(f"Splitting chunk id={chunk_id} at word_index={word_index}")
    chunk = session.get(Chunk, chunk_id)
    if not chunk:
        logger.warning(f"Chunk not found for split: id={chunk_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chunk not found")
    if word_index <= 0 or word_index >= len(chunk.text.split()):
        logger.warning(f"Invalid split index {word_index} for chunk id={chunk_id}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid split index")
    before, after = split_chunk_text(chunk.text, word_index)
    chunk.text = before
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
    logger.info(f"Chunk split successful: old_chunk_id={chunk.id}, new_chunk_id={new_chunk.id}")
    return [chunk, new_chunk]

@router.post("/chunk/combine", response_model=ChunkRead, name="combine_chunks")
def combine_chunks(first_chunk_id: int, second_chunk_id: int, session: Session = Depends(get_session)):
    logger.info(f"Combining chunks: first_chunk_id={first_chunk_id}, second_chunk_id={second_chunk_id}")
    first = session.get(Chunk, first_chunk_id)
    second = session.get(Chunk, second_chunk_id)
    if not first or not second:
        logger.warning(f"Chunk(s) not found for combine: first={first_chunk_id}, second={second_chunk_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chunk(s) not found")
    if first.position > second.position:
        first, second = second, first
    first.text = f"{first.text} {second.text}"
    session.delete(second)
    session.commit()
    session.refresh(first)
    logger.info(f"Chunks combined successfully: kept_chunk_id={first.id}, deleted_chunk_id={second.id}")
    return first

@router.put("/chunk/{chunk_id}", response_model=ChunkRead, name="update_chunk")
def update_chunk(chunk_id: int, chunk_data: dict = Body(...), session: Session = Depends(get_session)):
    logger.info(f"Updating chunk with id: {chunk_id}")
    chunk = session.get(Chunk, chunk_id)
    if not chunk:
        logger.warning(f"Chunk not found for update: id={chunk_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chunk not found")
    update_chunk_fields(chunk, chunk_data)
    session.add(chunk)
    session.commit()
    session.refresh(chunk)
    logger.info(f"Chunk updated successfully: id={chunk.id}")
    return chunk
