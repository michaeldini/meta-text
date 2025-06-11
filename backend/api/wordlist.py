
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel import select, Session, desc
from typing import List
from backend.db import get_session
from backend.models import WordDefinitionLog
from loguru import logger


router = APIRouter()


@router.get("/wordlist", response_model=List[WordDefinitionLog], name="get_wordlist")
def get_wordlist(session: Session = Depends(get_session)):
    logger.info("Retrieving wordlist")
    wordlist = session.exec(select(WordDefinitionLog).order_by(desc(WordDefinitionLog.id))).all()
    if not wordlist:
        logger.warning("No words found in the wordlist")
        raise HTTPException(status_code=404, detail="No words found in the wordlist")
    logger.info(f"Found {len(wordlist)} words in the wordlist")
    return wordlist
