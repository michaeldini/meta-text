# from sqlmodel import Session
# from backend.models import WordDefinitionWithContextRequest, ExplainPhraseWithContextRequest, WordDefinitionResponse, ExplainPhraseResponse
# from backend.services.openai_service import OpenAIService
# from backend.models import PhraseExplanation, WordDefinition
# from backend.exceptions.ai_exceptions import WordDefinitionValidationError
# from loguru import logger

# class WordOrPhraseExplanationService:
#     """
#     Service to handle both word and phrase explanations using a single instruction file.
#     Decides internally whether to treat input as a word or phrase.
#     """
#     def __init__(self, openai_service: OpenAIService | None = None):
#         self.openai_service = openai_service or OpenAIService()
#         self.instruction_file = "instructions/explain_word_or_phrase_with_context.txt"

#     def explain(self, words: str, context: str, meta_text_id: int, session: Session):
#         if not words:
#             raise WordDefinitionValidationError("words", "Missing words")
#         if meta_text_id is None:
#             raise WordDefinitionValidationError("meta_text_id", "Missing meta_text_id")

#         is_single_word = len(words.split()) == 1
#         prompt = f"words='{words}' context='{context}'"

#         ai_data = self.openai_service.generate_parsed_response(
#             self.instruction_file,
#             prompt,
#             WordDefinitionResponse if is_single_word else ExplainPhraseResponse
#         )

#         if is_single_word:
#             log_entry = WordDefinition(
#                 word=words,
#                 context=context,
#                 definition=ai_data.definition,
#                 definition_with_context=ai_data.definitionWithContext,
#                 meta_text_id=meta_text_id
#             )
#             session.add(log_entry)
#             session.commit()
#             logger.info(f"Word definition generated and saved for word: '{words}'")
#             return WordDefinitionResponse(
#                 definition=ai_data.definition,
#                 definitionWithContext=ai_data.definitionWithContext
#             )
#         else:
#             log_entry = PhraseExplanation(
#                 phrase=words,
#                 context=context,
#                 explanation=ai_data.explanation,
#                 explanation_with_context=ai_data.explanationWithContext,
#                 meta_text_id=meta_text_id
#             )
#             session.add(log_entry)
#             session.commit()
#             logger.info(f"Phrase explanation generated and saved for phrase: '{words}'")
#             return ExplainPhraseResponse(
#                 explanation=ai_data.explanation,
#                 explanationWithContext=ai_data.explanationWithContext
#             )
