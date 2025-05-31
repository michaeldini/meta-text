from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from backend.models import SourceDocument
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

# @router.post("/ai-complete-summary")
# async def complete_summary(request: Request, session=Depends(get_session)):
#     body = await request.json()
#     prompt = body.get("prompt")
#     if not prompt:
#         raise HTTPException(status_code=400, detail="Missing prompt.")
#     try:
#         instructions_path = os.path.join(os.path.dirname(__file__), "../instructions.txt")
#         with open(instructions_path, "r", encoding="utf-8") as f:
#             instructions = f.read()
#         title = body.get("title")
#         response = client.responses.parse(
#             model="gpt-4o-mini-2024-07-18",
#             instructions=instructions,
#             input=prompt,
#             text_format=AiSummaryResponse,
#         )
#         ai_data = response.output_parsed
#         if title:
#             doc = session.exec(select(SourceDocument).where(SourceDocument.title == title)).first()
#             if not doc:
#                 raise HTTPException(status_code=404, detail="Source document not found.")
#             details = session.exec(select(SourceDocumentDetails).where(SourceDocumentDetails.source_document_id == doc.id)).first()
#             if details is None:
#                 details = SourceDocumentDetails(
#                     source_document_id=doc.id,
#                     summary=ai_data.summary,
#                     characters=json.dumps(ai_data.characters),
#                     locations=json.dumps(ai_data.locations),
#                     themes=json.dumps(ai_data.themes),
#                     symbols=json.dumps(ai_data.symbols),
#                 )
#                 session.add(details)
#             else:
#                 details.summary = ai_data.summary
#                 details.characters = json.dumps(ai_data.characters)
#                 details.locations = json.dumps(ai_data.locations)
#                 details.themes = json.dumps(ai_data.themes)
#                 details.symbols = json.dumps(ai_data.symbols)
#             session.commit()
#         return {"result": ai_data}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

# @router.get("/ai-summary/{title}")
# def get_ai_summary(title: str, session=Depends(get_session)):
#     doc = session.exec(select(SourceDocument).where(SourceDocument.title == title)).first()
#     if not doc:
#         raise HTTPException(status_code=404, detail="Source document not found.")
#     details = session.exec(select(SourceDocumentDetails).where(SourceDocumentDetails.source_document_id == doc.id)).first()
#     if not details:
#         raise HTTPException(status_code=404, detail="No summary found.")
#     return {
#         "result": {
#             "summary": details.summary,
#             "characters": json.loads(details.characters),
#             "locations": json.loads(details.locations),
#             "themes": json.loads(details.themes),
#             "symbols": json.loads(details.symbols),
#         }
#     }
