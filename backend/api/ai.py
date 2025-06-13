from fastapi import APIRouter, HTTPException, Depends, Form, status
from backend.models import SourceDocument, WordDefinitionResponse, WordDefinitionWithContextRequest, WordDefinition
from backend.db import get_session
from openai import OpenAI
from backend.models import SourceDocInfoAiResponse, SourceDocInfoRequest, SourceDocInfoResponse,AiImage, AiImageRead, Chunk
from sqlmodel import Session
import os
import json
import base64
import datetime
from loguru import logger

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
router = APIRouter()

def save_base64_image(b64_data: str, output_dir: str = '../../public/generated_images') -> str:
    """Decode base64 image data, save to output_dir, and return relative path."""
    timestamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d%H%M%S%f")
    filename = f"ai_image_{timestamp}.png"
    rel_path = f"generated_images/{filename}"
    abs_path = os.path.join(os.path.dirname(__file__), output_dir, filename)
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    image_data = base64.b64decode(b64_data)
    with open(abs_path, "wb") as f:
        f.write(image_data)
    return rel_path

def extract_openai_error_message(e: Exception) -> str | None:
    """Try to extract a detailed error message from an OpenAI exception."""
    if hasattr(e, 'args') and e.args:
        arg0 = e.args[0]
        try:
            if isinstance(arg0, dict):
                error_json = arg0
            elif isinstance(arg0, str):
                error_json = json.loads(arg0)
            else:
                error_json = None
            if error_json and 'error' in error_json and error_json['error'].get('message'):
                return error_json['error']['message']
        except Exception:
            pass
    return None


def read_instructions_file(filename: str) -> str:
    """Read and return the contents of an instructions file relative to this file."""
    instructions_path = os.path.join(os.path.dirname(__file__), filename)
    with open(instructions_path, "r", encoding="utf-8") as f:
        return f.read()

@router.get("/generate-chunk-note-summary-text-comparison/{chunk_id}")
async def generate_chunk_note_summary_text_comparison(chunk_id: int, session: Session = Depends(get_session)) -> dict:
    logger.info(f"Generating chunk note/summary/comparison for chunk_id: {chunk_id}")
    chunk = session.get(Chunk, chunk_id)
    if not chunk:
        logger.warning(f"Chunk not found: id={chunk_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chunk not found.")
    # Compose prompt for AI
    prompt = (
        f"CHUNK TEXT:\n{chunk.text}\n\n"
        f"SUMMARY FIELD:\n{chunk.summary}\n\n"
        f"NOTES FIELD:\n{chunk.notes}\n\n"
    )
    try:
        instructions = read_instructions_file("../note_summary_comparison_instructions.txt")
        response = client.responses.create(
            model="gpt-4o-mini-2024-07-18",
            instructions=instructions,
            input=prompt,
        )
        ai_text = response.output_text
        # Save to DB
        chunk.comparison = ai_text
        session.add(chunk)
        session.commit()
        logger.info(f"AI comparison generated and saved for chunk_id: {chunk_id}")
        return {"result": ai_text}
    except Exception as e:
        logger.error(f"OpenAI error during chunk comparison for chunk_id={chunk_id}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"OpenAI error: {str(e)}")
    
@router.post("/generate-definition-in-context")
async def generate_definition_in_context(request: WordDefinitionWithContextRequest, session: Session = Depends(get_session)) -> WordDefinitionResponse:
    logger.info(f"Generating definition in context for word: '{request.word}'")
    word = request.word
    context = request.context
    meta_text_id = request.meta_text_id
    if not word:
        logger.warning("Missing word in definition request")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing word.")
    if meta_text_id is None:
        logger.warning("Missing meta_text_id in definition request")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing meta_text_id.")
    try:
        instructions = read_instructions_file("../definition_with_context_instructions.txt")
        response = client.responses.parse(
            model="gpt-4o-mini-2024-07-18",
            instructions=instructions,
            input=f"word='{word}' context='{context}'",
            text_format=WordDefinitionResponse,
        )
        ai_data = response.output_parsed
        if ai_data is None:
            logger.error(f"Failed to parse AI response for word: '{word}'")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to parse AI response.")
        # Save to DB
        log_entry = WordDefinition(
            word=word,
            context=context,
            definition=ai_data.definition,
            definition_with_context=ai_data.definitionWithContext,
            meta_text_id=meta_text_id
        )
        session.add(log_entry)
        session.commit()
        logger.info(f"Definition in context generated and saved for word: '{word}'")
        return WordDefinitionResponse(definition=ai_data.definition, definitionWithContext=ai_data.definitionWithContext)
    except Exception as e:
        logger.error(f"OpenAI error during definition in context for word='{word}': {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"OpenAI error: {str(e)}")


@router.post("/source-doc-info")
async def source_doc_info(request: SourceDocInfoRequest, session=Depends(get_session)) -> SourceDocInfoResponse:
    logger.info(f"Generating source doc info for doc_id: {request.id}")
    prompt = request.prompt[:10_000]
    doc_id = request.id
    if not prompt:
        logger.warning("Missing prompt in source doc info request")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing prompt.")
    try:
        instructions = read_instructions_file("../source_doc_info_instructions.txt")
        response = client.responses.parse(
            model="gpt-4o-mini-2024-07-18",
            instructions=instructions,
            input=prompt,
            text_format=SourceDocInfoAiResponse,
        )
        ai_data = response.output_parsed
        if ai_data is None:
            logger.error("Failed to parse AI response for source doc info")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to parse AI response.")
        if doc_id is not None:
            doc = session.get(SourceDocument, doc_id)
            if not doc:
                logger.warning(f"Source document not found for doc_id: {doc_id}")
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Source document not found.")
            doc.summary = ai_data.summary
            doc.characters = ", ".join(ai_data.characters) if ai_data.characters else None
            doc.locations = ", ".join(ai_data.locations) if ai_data.locations else None
            doc.themes = ", ".join(ai_data.themes) if ai_data.themes else None
            doc.symbols = ", ".join(ai_data.symbols) if ai_data.symbols else None
            session.add(doc)
            session.commit()
            logger.info(f"Source doc info updated in DB for doc_id: {doc_id}")
        return SourceDocInfoResponse(result=ai_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"OpenAI error during source doc info for doc_id={doc_id}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"OpenAI error: {str(e)}")

@router.post("/generate-image", response_model=AiImageRead)
async def generate_image(prompt: str = Form(...), chunk_id: int = Form(None), session: Session = Depends(get_session)):
    logger.info(f"Generating AI image for prompt: '{prompt}' and chunk_id: {chunk_id}")
    if not prompt:
        logger.warning("Missing prompt in generate image request")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing prompt.")
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
            logger.error("No image data returned from OpenAI.")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No image data returned from OpenAI.")
        rel_path = save_base64_image(img.data[0].b64_json)
        # Save new record to DB (allow multiple images per chunk)
        ai_image = AiImage(prompt=prompt, path=rel_path, chunk_id=chunk_id)
        session.add(ai_image)
        session.commit()
        logger.info(f"AI image generated and saved: {rel_path} (chunk_id={chunk_id})")
        return ai_image
    except Exception as e:
        import traceback
        logger.error(f"AI image generation error for prompt='{prompt}': {e}")
        traceback.print_exc()
        error_message = extract_openai_error_message(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_message or str(e) or 'Unknown error')