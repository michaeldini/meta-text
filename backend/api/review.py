from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, Session, desc
from typing import List
from backend.db import get_session
from backend.models import WordDefinition
from loguru import logger


router = APIRouter()


@router.get("/metatext/{metatext_id}/wordlist", response_model=List[WordDefinition], name="get_wordlist")
def get_wordlist(metatext_id: int, session: Session = Depends(get_session)):
    logger.info(f"Retrieving wordlist for metatext_id={metatext_id}")
    wordlist = session.exec(
        select(WordDefinition).where(WordDefinition.meta_text_id == metatext_id).order_by(desc(WordDefinition.id))
    ).all()
    if not wordlist:
        logger.warning(f"No words found in the wordlist for metatext_id={metatext_id}")
        raise HTTPException(status_code=404, detail="No words found in the wordlist for this metatext")
    logger.info(f"Found {len(wordlist)} words in the wordlist for metatext_id={metatext_id}")
    return wordlist
