from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import List

from backend.db import get_session
from backend.models import ChunkCompression, ChunkCompressionRead, ChunkCompressionBase

router = APIRouter()

class ChunkCompressionCreate(BaseModel):
    title: str
    compressed_text: str

@router.post("/chunk/{chunk_id}/compressions", response_model=ChunkCompressionRead)
def create_chunk_compression(chunk_id: int, data: ChunkCompressionCreate, session: Session = Depends(get_session)):
    obj = ChunkCompression(**data.model_dump(), chunk_id=chunk_id)
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return obj

@router.get("/chunk/{chunk_id}/compressions", response_model=List[ChunkCompressionRead])
def list_chunk_compressions(chunk_id: int, session: Session = Depends(get_session)):
    compressions = session.exec(select(ChunkCompression).where(ChunkCompression.chunk_id == chunk_id)).all()
    return compressions

@router.get("/chunk-compression/{compression_id}", response_model=ChunkCompressionRead)
def get_chunk_compression(compression_id: int, session: Session = Depends(get_session)):
    obj = session.get(ChunkCompression, compression_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compression not found")
    return obj

@router.put("/chunk-compression/{compression_id}", response_model=ChunkCompressionRead)
def update_chunk_compression(compression_id: int, data: ChunkCompressionBase, session: Session = Depends(get_session)):
    obj = session.get(ChunkCompression, compression_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compression not found")
    for field, value in data.model_dump().items():
        setattr(obj, field, value)
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return obj

@router.delete("/chunk-compression/{compression_id}", status_code=204)
def delete_chunk_compression(compression_id: int, session: Session = Depends(get_session)):
    obj = session.get(ChunkCompression, compression_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compression not found")
    session.delete(obj)
    session.commit()
    return None
