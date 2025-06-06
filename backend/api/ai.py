from fastapi import APIRouter, HTTPException, Depends
from backend.models import SourceDocument, WordDefinitionResponse, WordDefinitionWithContextRequest
from backend.db import get_session
import os
from openai import OpenAI
from backend.models import SourceDocInfoAiResponse, SourceDocInfoRequest, SourceDocInfoResponse, ChunkAiSummaryRequest, ChunkAiSummaryResponse


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

router = APIRouter()

@router.post("/generate-chunk-ai-summary")
async def generate_chunk_ai_summary(request: ChunkAiSummaryRequest) -> ChunkAiSummaryResponse:
    prompt = request.prompt
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
        return ChunkAiSummaryResponse(result=ai_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")
    
@router.post("/generate-definition-in-context")
async def generate_definition_in_context(request: WordDefinitionWithContextRequest) -> WordDefinitionResponse:
    word = request.word
    context = request.context
    if not word:
        raise HTTPException(status_code=400, detail="Missing word.")
    try:
        instructions_path = os.path.join(os.path.dirname(__file__), "../definition_with_context_instructions.txt")
        with open(instructions_path, "r", encoding="utf-8") as f:
            instructions = f.read()
        response = client.responses.parse(
            model="gpt-4o-mini-2024-07-18",
            instructions=instructions,
            input=f"word='{word}' context='{context}'",
            text_format=WordDefinitionResponse,
        )
        ai_data = response.output_parsed
        if ai_data is None:
            raise HTTPException(status_code=500, detail="Failed to parse AI response.")
        return WordDefinitionResponse(definition=ai_data.definition, definitionWithContext=ai_data.definitionWithContext)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

@router.post("/source-doc-info")
async def source_doc_info(request: SourceDocInfoRequest, session=Depends(get_session)) -> SourceDocInfoResponse:
    prompt = request.prompt
    doc_id = request.id
    if not prompt:
        raise HTTPException(status_code=400, detail="Missing prompt.")
    try:
        instructions_path = os.path.join(os.path.dirname(__file__), "../instructions.txt")
        with open(instructions_path, "r", encoding="utf-8") as f:
            instructions = f.read()
        response = client.responses.parse(
            model="gpt-4o-mini-2024-07-18",
            instructions=instructions,
            input=prompt,
            text_format=SourceDocInfoAiResponse,
        )
        ai_data = response.output_parsed
        if ai_data is None:
            raise HTTPException(status_code=500, detail="Failed to parse AI response.")
        if doc_id is not None:
            doc = session.get(SourceDocument, doc_id)
            if not doc:
                raise HTTPException(status_code=404, detail="Source document not found.")
            doc.summary = ai_data.summary
            doc.characters = ", ".join(ai_data.characters) if ai_data.characters else None
            doc.locations = ", ".join(ai_data.locations) if ai_data.locations else None
            doc.themes = ", ".join(ai_data.themes) if ai_data.themes else None
            doc.symbols = ", ".join(ai_data.symbols) if ai_data.symbols else None
            session.add(doc)
            session.commit()
        return SourceDocInfoResponse(result=ai_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")
