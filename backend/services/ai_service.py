"""AI service for handling AI-related business logic."""
from sqlmodel import Session
from loguru import logger

from backend.models import (
    Chunk, WordDefinition, SourceDocument, AiImage,
    WordDefinitionResponse, WordDefinitionWithContextRequest,
    SourceDocInfoRequest, SourceDocInfoResponse, SourceDocInfoAiResponse
)
from backend.services.openai_service import OpenAIService
from backend.services.file_service import FileService
from backend.exceptions.ai_exceptions import (
    ChunkNotFoundError,
    WordDefinitionValidationError,
    SourceDocumentNotFoundError,
    PromptValidationError
)


class AIService:
    """Service for AI operations business logic."""
    
    def __init__(self, openai_service: OpenAIService | None = None, file_service: FileService | None = None):
        """
        Initialize AI service with dependency injection.
        
        Args:
            openai_service: OpenAI service instance
            file_service: File service instance
        """
        self.openai_service = openai_service or OpenAIService()
        self.file_service = file_service or FileService()
    
    def generate_chunk_comparison(self, chunk_id: int, session: Session) -> dict:
        """
        Generate AI comparison for a chunk's notes, summary, and text.
        
        Args:
            chunk_id: ID of the chunk to analyze
            session: Database session
            
        Returns:
            Dictionary with the generated comparison result
            
        Raises:
            ChunkNotFoundError: If chunk is not found
        """
        logger.info(f"Generating chunk comparison for chunk_id: {chunk_id}")
        
        # Get chunk from database
        chunk = session.get(Chunk, chunk_id)
        if not chunk:
            logger.warning(f"Chunk not found: id={chunk_id}")
            raise ChunkNotFoundError(chunk_id)
        
        # Compose prompt for AI
        prompt = (
            f"CHUNK TEXT:\n{chunk.text}\n\n"
            f"SUMMARY FIELD:\n{chunk.summary}\n\n"
            f"NOTES FIELD:\n{chunk.notes}\n\n"
        )
        
        # Generate AI response
        ai_text = self.openai_service.generate_text_response(
            "instructions/note_summary_comparison_instructions.txt",
            prompt
        )
        
        # Save result to database
        chunk.comparison = ai_text
        session.add(chunk)
        session.commit()
        
        logger.info(f"AI comparison generated and saved for chunk_id: {chunk_id}")
        return {"result": ai_text}
    
    def generate_word_definition(self, request: WordDefinitionWithContextRequest, session: Session) -> WordDefinitionResponse:
        """
        Generate word definition with context using AI.
        
        Args:
            request: Word definition request data
            session: Database session
            
        Returns:
            Word definition response
            
        Raises:
            WordDefinitionValidationError: If request validation fails
        """
        logger.info(f"Generating definition for word: '{request.word}'")
        
        # Validate request
        if not request.word:
            raise WordDefinitionValidationError("word", "Missing word")
        if request.meta_text_id is None:
            raise WordDefinitionValidationError("meta_text_id", "Missing meta_text_id")
        
        # Prepare prompt
        prompt = f"word='{request.word}' context='{request.context}'"
        
        # Generate AI response
        ai_data = self.openai_service.generate_parsed_response(
            "instructions/definition_with_context_instructions.txt",
            prompt,
            WordDefinitionResponse
        )
        
        # Save to database
        log_entry = WordDefinition(
            word=request.word,
            context=request.context,
            definition=ai_data.definition,
            definition_with_context=ai_data.definitionWithContext,
            meta_text_id=request.meta_text_id
        )
        session.add(log_entry)
        session.commit()
        
        logger.info(f"Definition generated and saved for word: '{request.word}'")
        return WordDefinitionResponse(
            definition=ai_data.definition, 
            definitionWithContext=ai_data.definitionWithContext
        )
    
    def generate_source_document_info(self, request: SourceDocInfoRequest, session: Session) -> SourceDocInfoResponse:
        """
        Generate source document information using AI.
        
        Args:
            request: Source document info request
            session: Database session
            
        Returns:
            Source document info response
            
        Raises:
            PromptValidationError: If prompt validation fails
            SourceDocumentNotFoundError: If source document is not found
        """
        logger.info(f"Generating source doc info for doc_id: {request.id}")
        
        # Validate request
        if not request.prompt:
            raise PromptValidationError("Missing prompt")
        
        # Truncate prompt to reasonable length
        prompt = request.prompt[:10_000]
        
        # Generate AI response
        ai_data = self.openai_service.generate_parsed_response(
            "instructions/source_doc_info_instructions.txt",
            prompt,
            SourceDocInfoAiResponse
        )
        
        # Update source document if ID provided
        if request.id is not None:
            doc = session.get(SourceDocument, request.id)
            if not doc:
                logger.warning(f"Source document not found for doc_id: {request.id}")
                raise SourceDocumentNotFoundError(request.id)
            
            # Update document fields
            doc.summary = ai_data.summary
            doc.characters = ", ".join(ai_data.characters) if ai_data.characters else None
            doc.locations = ", ".join(ai_data.locations) if ai_data.locations else None
            doc.themes = ", ".join(ai_data.themes) if ai_data.themes else None
            doc.symbols = ", ".join(ai_data.symbols) if ai_data.symbols else None
            
            session.add(doc)
            session.commit()
            
            logger.info(f"Source doc info updated in DB for doc_id: {request.id}")
        
        return SourceDocInfoResponse(result=ai_data)
    
    def generate_image(self, prompt: str, chunk_id: int | None, session: Session) -> AiImage:
        """
        Generate AI image using DALL-E.
        
        Args:
            prompt: Text prompt for image generation
            chunk_id: Optional chunk ID to associate with image
            session: Database session
            
        Returns:
            Created AI image record
            
        Raises:
            PromptValidationError: If prompt validation fails
        """
        logger.info(f"Generating AI image for prompt: '{prompt}' and chunk_id: {chunk_id}")
        
        # Validate request
        if not prompt:
            raise PromptValidationError("Missing prompt")
        
        # Generate image using OpenAI
        b64_image_data = self.openai_service.generate_image(prompt)
        
        # Save image to file system
        rel_path = self.file_service.save_base64_image(b64_image_data)
        
        # Save record to database
        ai_image = AiImage(prompt=prompt, path=rel_path, chunk_id=chunk_id)
        session.add(ai_image)
        session.commit()
        
        logger.info(f"AI image generated and saved: {rel_path} (chunk_id={chunk_id})")
        return ai_image
