from sqlmodel import Session
from backend.models import ExplanationResponse, WordDefinitionResponse, ExplainPhraseResponse
from backend.services.openai_service import OpenAIService
from backend.models import PhraseExplanation, WordDefinition
from backend.exceptions.ai_exceptions import WordDefinitionValidationError
from loguru import logger

class WordsExplanationService:
    """
    Service to handle explanations for one or more words using a single instruction file.
    Decides internally whether to treat input as a single word or multiple words.
    """
    def __init__(self, openai_service: OpenAIService | None = None):
        self.openai_service = openai_service or OpenAIService()
        self.instruction_file = "instructions/explain_words_with_context.txt"

    def explain(self, words: str, context: str, meta_text_id: int, session: Session):
        if not words:
            raise WordDefinitionValidationError("words", "Missing words")
        if meta_text_id is None:
            raise WordDefinitionValidationError("meta_text_id", "Missing meta_text_id")

        is_single_word = len(words.split()) == 1
        prompt = f"words='{words}' context='{context}'"

        ai_data : ExplanationResponse = self.openai_service.generate_parsed_response(
            self.instruction_file,
            prompt,
            ExplanationResponse
        )

        if is_single_word:
            log_entry = WordDefinition(
                word=words,
                context=context,
                definition=ai_data.explanation,
                definition_with_context=ai_data.explanationWithContext,
                meta_text_id=meta_text_id
            )
            session.add(log_entry)
            session.commit()
            logger.info(f"Word definition generated and saved for word: '{words}'")
            return ExplanationResponse(
                explanation=ai_data.explanation,
                explanationWithContext=ai_data.explanationWithContext
            )
        else:
            log_entry = PhraseExplanation(
                phrase=words,
                context=context,
                explanation=ai_data.explanation,
                explanation_with_context=ai_data.explanationWithContext,
                meta_text_id=meta_text_id
            )
            session.add(log_entry)
            session.commit()
            logger.info(f"Words explanation generated and saved for: '{words}'")
            return ExplainPhraseResponse(
                explanation=ai_data.explanation,
                explanationWithContext=ai_data.explanationWithContext
            )
