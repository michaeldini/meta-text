from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from backend.db import get_session
from backend import models
from backend.api.schemas import word_lookup
from freedictionaryapi.clients.async_client import AsyncDictionaryApiClient
from freedictionaryapi.errors import DictionaryApiError

router = APIRouter()

@router.post("/lookup", response_model=word_lookup.WordLookupResponse)
async def lookup_word(word: str, session: Session = Depends(get_session)):
    # Check if word already exists in DB
    statement = select(models.WordLookup).where(models.WordLookup.word == word)
    result = session.exec(statement).first()
    if result:
        return result
    # Fetch definition from FreeDictionaryAPI
    async with AsyncDictionaryApiClient() as client:
        try:
            parser = await client.fetch_parser(word)
            definitions = parser.get_all_definitions()
            if not definitions:
                raise HTTPException(status_code=404, detail="Definition not found")
            definition = definitions[0]
        except DictionaryApiError as e:
            raise HTTPException(status_code=404, detail=f"Definition not found: {e}")
    # Store in DB
    word_entry = models.WordLookup(word=word, definition=definition)
    session.add(word_entry)
    session.commit()
    session.refresh(word_entry)
    return word_entry
