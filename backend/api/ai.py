from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from backend.models import SourceDocument
from backend.db import get_session
import os
import json
from openai import OpenAI
from sqlmodel import select

class SourceDocInfoAiResponse(BaseModel):
    summary: str
    characters: list[str]
    locations: list[str]
    themes: list[str]
    symbols: list[str]

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

router = APIRouter()

@router.post("/ai-short-summary")
async def generate_short_summary(request: Request):
    body = await request.json()
    prompt = body.get("prompt")
    if not prompt:
        raise HTTPException(status_code=400, detail="Missing prompt.")
    try:
        response = client.responses.create(
            model="gpt-4o-mini-2024-07-18",
            instructions="Write a helpful and extremely concise one sentence summary.",
            input=prompt,
            max_output_tokens=1024,
        )
        ai_text = response.output_text
        return {"result": ai_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

@router.post("/ai-symbolism")
async def symbolism_prompt(request: Request):
    body = await request.json()
    prompt = body.get("prompt")
    if not prompt:
        raise HTTPException(status_code=400, detail="Missing prompt.")
    try:
        response = client.responses.create(
            model="gpt-4o-mini-2024-07-18",
            instructions="Only list and briefly describe any symbolisms.",
            input=prompt,
            max_output_tokens=1024,
        )
        ai_text = response.output_text
        return {"result": ai_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

@router.post("/source-doc-info")
async def source_doc_info(request: Request, session=Depends(get_session)):
    body = await request.json()
    prompt = body.get("prompt")
    if not prompt:
        raise HTTPException(status_code=400, detail="Missing prompt.")
    try:
        instructions_path = os.path.join(os.path.dirname(__file__), "../instructions.txt")
        with open(instructions_path, "r", encoding="utf-8") as f:
            instructions = f.read()
        title = body.get("title")
        response = client.responses.parse(
            model="gpt-4o-mini-2024-07-18",
            instructions=instructions,
            input=prompt,
            text_format=SourceDocInfoAiResponse,
        )
        ai_data = response.output_parsed
        if ai_data is None:
            raise HTTPException(status_code=500, detail="Failed to parse AI response.")
        if title:
            doc = session.exec(select(SourceDocument).where(SourceDocument.title == title)).first()
            if not doc:
                raise HTTPException(status_code=404, detail="Source document not found.")
            # Store each field directly in the model (convert lists to comma-separated strings)
            doc.summary = ai_data.summary
            doc.characters = ", ".join(ai_data.characters) if ai_data.characters else None
            doc.locations = ", ".join(ai_data.locations) if ai_data.locations else None
            doc.themes = ", ".join(ai_data.themes) if ai_data.themes else None
            doc.symbols = ", ".join(ai_data.symbols) if ai_data.symbols else None
            session.add(doc)
            session.commit()
        return {"result": ai_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

@router.get("/ai-summary/{title}")
def get_ai_summary(title: str, session=Depends(get_session)):
    doc = session.exec(select(SourceDocument).where(SourceDocument.title == title)).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Source document not found.")
    details = doc.details
    if not details:
        raise HTTPException(status_code=404, detail="No summary found.")
    return {
        "result": json.loads(details)
    }
