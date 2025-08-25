"""
A service to handle explanations for one or more words:

Single word inputs will be saved as `WordDefinition`.
Multiple word inputs will be saved as `PhraseExplanation`.

Returns a consistent `ExplanationResponse` regardless of input type.
"""

from sqlmodel import Session, select
from backend.models import ExplanationResponse,ExplanationResponse2,  ExplanationsResponse, User, Explanation, ExplanationType
from backend.services.openai_service import OpenAIService
from backend.exceptions.ai_exceptions import WordDefinitionValidationError
from loguru import logger

class ExplanationService:
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
            session.commit()  # TODO: DRY
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

    def get_review_data(self, metatext_id: int, user_id: int, session: Session) -> ExplanationsResponse:
        """
        Get all review data (word_list, explanations) for a specific metatext and user.
        Returns a ExplanationsResponse: with word_list (type==word) and phrase_list (type==phrase).
        """
        
        # Fetch all Explanation records for this metatext and user
        explanations = list(session.exec(
            select(Explanation)
            .where((Explanation.metatext_id == metatext_id) & (Explanation.user_id == user_id))
        ).all())
        
        # Filter by type and return
        return ExplanationsResponse(
            word_list=[e for e in explanations if e.type == ExplanationType.word],
            phrase_list=[e for e in explanations if e.type == ExplanationType.phrase]
        )

    def explain2(self, word: str, session: Session, context: str | None = None) -> ExplanationResponse2:
        if not word:
            raise WordDefinitionValidationError("word", "Missing word")

        prompt = f"word='{word}'"
        if context:
            # Trim excessive context to avoid blowing up prompt size
            trimmed = context.strip()
            if len(trimmed) > 1200:
                trimmed = trimmed[:1200]
            prompt += f" context='{trimmed}'"

        ai_data: ExplanationResponse2 = self.openai_service.generate_parsed_response(
            "instructions/explain2.txt",
            prompt,
            ExplanationResponse2
        )

        # log_entry = Explanation.create_with_type(
        #     user_id=user.id,
        #     words=word,
        #     explanation=ai_data.explanation,
        #     metatext_id=None  # No metatext_id for single word explanations
        # )
        # session.add(log_entry)
        # session.commit()
        # logger.info(f"Word definition generated and saved for word: '{word}'")

        return ai_data