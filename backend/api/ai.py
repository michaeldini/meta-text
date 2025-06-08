from fastapi import APIRouter, HTTPException, Depends, Form
from backend.models import SourceDocument, WordDefinitionResponse, WordDefinitionWithContextRequest
from backend.db import get_session
import os
from openai import OpenAI
from backend.models import SourceDocInfoAiResponse, SourceDocInfoRequest, SourceDocInfoResponse, ChunkAiSummaryRequest, ChunkAiSummaryResponse, ChunkAiComparisonSummaryRequest, ChunkAiComparisonSummaryResponse
from sqlmodel import Session
from backend.models import AiImage, AiImageCreate, AiImageRead, Chunk
import base64
from datetime import datetime

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

router = APIRouter()

@router.post("/generate-chunk-ai-comparison-summary")
async def generate_chunk_ai_comparison_summary(request: ChunkAiComparisonSummaryRequest, session: Session = Depends(get_session)) -> ChunkAiComparisonSummaryResponse:
    chunk_id = request.chunk_id
    chunk = session.get(Chunk, chunk_id)
    if not chunk:
        raise HTTPException(status_code=404, detail="Chunk not found.")
    # Compose prompt for AI
    prompt = (
        f"CHUNK TEXT:\n{chunk.text}\n\n"
        f"SUMMARY FIELD:\n{chunk.summary}\n\n"
        f"NOTES FIELD:\n{chunk.notes}\n\n"
    )
    try:
        response = client.responses.create(
            model="gpt-4o-mini-2024-07-18",
            instructions="Compare the summary and notes fields to the chunk text. Return a single, concise paragraph summarizing your comparison. Example response: 'You correctly identified the symbolism of the rose in the text, it also means passion, but missed the significance of the river. The river represents the passage of time and the flow of life, which is a key theme in the story. Also, the old man and the boy are not just characters, they symbolize the passage of time and the cycle of life.'",
            input=prompt,
        )
        ai_text = response.output_text
        # Save to DB
        chunk.aiSummary = ai_text
        session.add(chunk)
        session.commit()
        return ChunkAiComparisonSummaryResponse(result=ai_text)
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

@router.post("/generate-image", response_model=AiImageRead)
async def generate_image(prompt: str = Form(...), chunk_id: int = Form(None), session: Session = Depends(get_session)):
    if not prompt:
        raise HTTPException(status_code=400, detail="Missing prompt.")
    try:
        img = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            size="1024x1024",
            response_format="b64_json",
            style="natural", # for DALL-E 3 only
        )
        if not img.data or not hasattr(img.data[0], "b64_json") or not img.data[0].b64_json:
            raise HTTPException(status_code=500, detail="No image data returned from OpenAI.")
        # Save image to public/generated_images
        image_data = base64.b64decode(img.data[0].b64_json)
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        filename = f"ai_image_{timestamp}.png"
        rel_path = f"generated_images/{filename}"
        abs_path = os.path.join(os.path.dirname(__file__), '../../public', rel_path)
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)
        with open(abs_path, "wb") as f:
            f.write(image_data)
        # Save new record to DB (allow multiple images per chunk)
        ai_image = AiImage(prompt=prompt, path=rel_path, chunk_id=chunk_id)
        session.add(ai_image)
        session.commit()
        session.refresh(ai_image)
        # Return the most recent image for this chunk
        from sqlmodel import select, desc
        latest_image = session.exec(
            select(AiImage).where(AiImage.chunk_id == chunk_id).order_by(desc(AiImage.id))
        ).first()
        if latest_image:
            return AiImageRead(id=latest_image.id, prompt=latest_image.prompt, path=latest_image.path, chunk_id=latest_image.chunk_id)
        else:
            # fallback: return the just-created image (should not happen, but safe)
            return AiImageRead(id=ai_image.id, prompt=ai_image.prompt, path=ai_image.path, chunk_id=ai_image.chunk_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")