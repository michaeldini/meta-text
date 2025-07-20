"""
A service to handle explanations for one or more words:

Single word inputs will be saved as `WordDefinition`.
Multiple word inputs will be saved as `PhraseExplanation`.

Returns a consistent `ExplanationResponse` regardless of input type.
"""

from sqlmodel import Session
from backend.models import ExplanationResponse, User, Explanation
from backend.services.openai_service import OpenAIService
from backend.exceptions.ai_exceptions import WordDefinitionValidationError
from loguru import logger

class WordsExplanationService:
    """
    Service to handle explanations for one or more words using a single instruction file.
    Decides internally whether to treat input as a single word or multiple words.
    Returns a consistent ExplanationResponse regardless of input type.
    """
    def __init__(self, openai_service: OpenAIService | None = None):
        self.openai_service = openai_service or OpenAIService()
        self.instruction_file = "instructions/explain_words_with_context.txt"

    def explain(self, user: User, words: str, context: str, metatext_id: int, session: Session) -> ExplanationResponse:
        if not words:
            raise WordDefinitionValidationError("words", "Missing words")
        if metatext_id is None:
            raise WordDefinitionValidationError("metatext_id", "Missing metatext_id")

        is_single_word = len(words.split()) == 1
        prompt = f"words='{words}' context='{context}'"

        ai_data : ExplanationResponse = self.openai_service.generate_parsed_response(
            self.instruction_file,
            prompt,
            ExplanationResponse
        )

        if is_single_word:
            log_entry = Explanation.create_with_type(
                user_id=user.id,
                words=words,
                context=context,
                explanation=ai_data.explanation,
                explanation_in_context=ai_data.explanation_in_context,
                metatext_id=metatext_id
            )
            session.add(log_entry)
            session.commit()
            logger.info(f"Word definition generated and saved for word: '{words}'")
        else:
            log_entry = Explanation.create_with_type(
                user_id=user.id,
                words=words,
                context=context,
                explanation=ai_data.explanation,
                explanation_in_context=ai_data.explanation_in_context,
                metatext_id=metatext_id
            )
            session.add(log_entry)
            session.commit()
            logger.info(f"Words explanation generated and saved for: '{words}'")
        
        return ExplanationResponse(
            explanation=ai_data.explanation,
            explanation_in_context=ai_data.explanation_in_context
        )
