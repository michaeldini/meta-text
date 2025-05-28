from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from backend.models import AiSummary
from backend.db import get_session
import os
import json
from openai import OpenAI
from sqlmodel import select

class AiSummaryResponse(BaseModel):
    title: str
    summary: str
    characters: list[str]
    locations: list[str]
    themes: list[str]
    symbols: list[str]

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

router = APIRouter()

@router.post("/ai-complete")
async def summarize_prompt(request: Request):
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

@router.post("/ai-complete-summary")
async def complete_summary(request: Request, session=Depends(get_session)):
    body = await request.json()
    prompt = body.get("prompt")
    if not prompt:
        raise HTTPException(status_code=400, detail="Missing prompt.")
    try:
        instructions_path = os.path.join(os.path.dirname(__file__), "../instructions.txt")
        with open(instructions_path, "r", encoding="utf-8") as f:
            instructions = f.read()
        label = body.get("label")
        response = client.responses.parse(
            model="gpt-4o-mini-2024-07-18",
            instructions=instructions,
            input=prompt,
            text_format=AiSummaryResponse,
        )
        ai_data = response.output_parsed
        if label:
            db_obj = session.exec(select(AiSummary).where(AiSummary.label == label)).first()
            if db_obj:
                db_obj.title = ai_data.title
                db_obj.summary = ai_data.summary
                db_obj.characters = json.dumps(ai_data.characters)
                db_obj.locations = json.dumps(ai_data.locations)
                db_obj.themes = json.dumps(ai_data.themes)
                db_obj.symbols = json.dumps(ai_data.symbols)
            else:
                db_obj = AiSummary(
                    label=label,
                    title=ai_data.title,
                    summary=ai_data.summary,
                    characters=json.dumps(ai_data.characters),
                    locations=json.dumps(ai_data.locations),
                    themes=json.dumps(ai_data.themes),
                    symbols=json.dumps(ai_data.symbols),
                )
                session.add(db_obj)
            session.commit()
        return {"result": ai_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

@router.get("/ai-summary/{label}")
def get_ai_summary(label: str, session=Depends(get_session)):
    db_obj = session.exec(select(AiSummary).where(AiSummary.label == label)).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="No summary found.")
    return {
        "result": {
            "title": db_obj.title,
            "summary": db_obj.summary,
            "characters": json.loads(db_obj.characters),
            "locations": json.loads(db_obj.locations),
            "themes": json.loads(db_obj.themes),
            "symbols": json.loads(db_obj.symbols),
        }
    }
