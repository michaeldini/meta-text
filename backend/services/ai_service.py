"""AI service for handling AI-related business logic."""
from sqlmodel import Session
from loguru import logger

from backend.models import (
    Chunk, Rewrite, SourceDocument, Image,
    SourceDocInfoResponse, SourceDocInfoAiResponse, Explanation, ExplanationResponse, ExplanationRequest, User
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
    
    def generate_evaluation(self, chunk_id: int, session: Session) -> dict:
        """
        Generate AI evaluation for a chunk's note, summary, and text.
        
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
            f"NOTES FIELD:\n{chunk.note}\n\n"
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

    def generate_word_definition(self, user: User, request: ExplanationRequest, session: Session) -> ExplanationResponse:
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
        logger.info(f"Generating definition for word: '{request.words}'")
        
        # Validate request
        if not request.words:
            raise WordDefinitionValidationError("words", "Missing words")
        if request.metatext_id is None:
            raise WordDefinitionValidationError("metatext_id", "Missing metatext_id")
        
        # Prepare prompt
        prompt = f"word='{request.words}' context='{request.context}'"
        
        # Generate AI response
        ai_data = self.openai_service.generate_parsed_response(
            "instructions/definition_with_context_instructions.txt",
            prompt,
            ExplanationResponse
        )
        
        # Save to database
        log_entry = Explanation(
            user_id=user.id,
            words=request.words,
            context=request.context,
            explanation=ai_data.explanation,
            explanation_in_context=ai_data.explanationInContext,
            metatext_id=request.metatext_id
        )
        session.add(log_entry)
        session.commit()
        
        logger.info(f"Definition generated and saved for word: '{request.words}'")
        return ExplanationResponse(
            explanation=ai_data.explanation,
            explanation_in_context=ai_data.explanationInContext
        )
    
    def generate_source_document_info(self, doc_id: int, session: Session) -> SourceDocInfoResponse:
        """
        Generate source document information using AI.
        
        Args:
            doc_id: Source document id
            session: Database session
            
        Returns:
            Source document info response
            
        Raises:
            PromptValidationError: If prompt validation fails
            SourceDocumentNotFoundError: If source document is not found
        """
        logger.info(f"Generating source doc info for doc_id: {doc_id}")
        doc = session.get(SourceDocument, doc_id)
        if not doc:
            logger.warning(f"Source document not found for doc_id: {doc_id}")
            raise SourceDocumentNotFoundError(doc_id)
        # Use the document title as the prompt
        prompt = doc.title if doc.title else ""
        if not prompt:
            raise PromptValidationError("Missing prompt (document title)")
        ai_data = self.openai_service.generate_parsed_response(
            "instructions/source_doc_info_instructions.txt",
            prompt,
            SourceDocInfoAiResponse
        )
        logger.debug(f"AI data generated: {ai_data}")
        # Update document fields
        doc.summary = ai_data.summary
        doc.characters = ", ".join(ai_data.characters) if ai_data.characters else None
        doc.locations = ", ".join(ai_data.locations) if ai_data.locations else None
        doc.themes = ", ".join(ai_data.themes) if ai_data.themes else None
        doc.symbols = ", ".join(ai_data.symbols) if ai_data.symbols else None
        session.add(doc)
        session.commit()
        logger.info(f"Source doc info updated in DB for doc_id: {doc_id}")
        return SourceDocInfoResponse(result=ai_data)
    
    def generate_image(self, prompt: str, chunk_id: int | None, session: Session) -> Image:
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
        ai_image = Image(prompt=prompt, path=rel_path, chunk_id=chunk_id)
        session.add(ai_image)
        session.commit()
        
        logger.info(f"AI image generated and saved: {rel_path} (chunk_id={chunk_id})")
        return ai_image
    
    def generate_rewrite(self, chunk_id: int, style_title: str, session: Session) -> Rewrite:
        """
        Generate a compressed version of a chunk's text in a given style using AI, and save it to the database.
        """
        logger.info(f"Generating chunk compression for chunk_id: {chunk_id} with style: {style_title}")
        
        # Get chunk from database
        chunk = session.get(Chunk, chunk_id)
        if not chunk:
            logger.warning(f"Chunk not found: id={chunk_id}")
            raise ChunkNotFoundError(chunk_id)
        
        # Compose prompt for AI
        prompt = f"Compress the following text {style_title}:\n{chunk.text}"
        
        # Generate AI response
        compressed_text = self.openai_service.generate_text_response(
            "instructions/chunk_compression_instructions.txt", prompt
        )

        obj = Rewrite(chunk_id=chunk_id, title=style_title, rewrite_text=compressed_text)

        session.add(obj)
        session.commit()
        session.refresh(obj)
        
        logger.info(f"AI chunk compression generated for chunk_id: {chunk_id} style: {style_title}")
        
        return obj

    def generate_chunk_explanation(self, user: User, chunk_id: int, session: Session) -> dict:
        """
        Generate a detailed, in-depth AI explanation for a chunk's text.
        
        Args:
            chunk_id: ID of the chunk to explain
            session: Database session
            
        Returns:
            Dictionary with the generated explanation result
            
        Raises:
            ChunkNotFoundError: If chunk is not found
        """
        logger.info(f"Generating chunk explanation for chunk_id: {chunk_id}")
        
        # Get chunk from database
        chunk = session.get(Chunk, chunk_id)
        if not chunk:
            logger.warning(f"Chunk not found: id={chunk_id}")
            raise ChunkNotFoundError(chunk_id)
        
        # Compose prompt for AI
        prompt = f"CHUNK TEXT TO EXPLAIN:\n{chunk.text}\n"
        
        # Generate AI response
        ai_text = self.openai_service.generate_text_response(
            "instructions/chunk_explanation_instructions.txt",
            prompt
        )
        
        # Save explanation to database
        chunk.explanation = ai_text
        session.add(chunk)
        session.commit()
        
        logger.info(f"AI explanation generated and saved for chunk_id: {chunk_id}")
        return {"explanation": ai_text}

    # def generate_phrase_explanation(self, user: User, request: ExplanationRequest, session: Session) -> ExplanationResponse:
    #     """
    #     Generate phrase explanation with context using AI.
        
    #     Args:
    #         request: Phrase explanation request data
    #         session: Database session
            
    #     Returns:
    #         Phrase explanation response
            
    #     Raises:
    #         WordDefinitionValidationError: If request validation fails
    #     """
    #     logger.info(f"Generating explanation for phrase: '{request.words}'")
        
    #     # Validate request
    #     if not request.words:
    #         raise WordDefinitionValidationError("phrase", "Missing phrase")
    #     if request.metatext_id is None:
    #         raise WordDefinitionValidationError("meta_text_id", "Missing meta_text_id")
        
    #     # Prepare prompt
    #     prompt = f"phrase='{request.words}' context='{request.context}'"
        
    #     # Generate AI response
    #     ai_data = self.openai_service.generate_parsed_response(
    #         "instructions/explain_phrase_with_context_instructions.txt",
    #         prompt,
    #         ExplanationResponse
    #     )
        
    #     # Save to database
    #     log_entry = Explanation(
    #         user_id=user.id,
    #         words=request.words,
    #         context=request.context,
    #         explanation=ai_data.explanation,
    #         explanation_in_context=ai_data.explanationInContext,
    #         metatext_id=request.metatext_id
    #     )
    #     session.add(log_entry)
    #     session.commit()
    #     logger.info(f"Explanation generated and saved for phrase: '{request.phrase}'")
    #     return ExplainPhraseResponse(
    #         explanation=ai_data.explanation,
    #         explanationWithContext=ai_data.explanationWithContext
    #     )
