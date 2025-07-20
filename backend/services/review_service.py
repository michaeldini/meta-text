"""Review service for managing wordlists and chunk summaries."""
from sqlmodel import select, Session, desc
from loguru import logger

from backend.models import Explanation, Chunk, Metatext, ReviewResponse, ExplanationType
from backend.exceptions.review_exceptions import (
    WordlistNotFoundError,
    ChunksNotFoundError
)


class ReviewService:
    """Service for review-related operations like word_lists and chunk summaries."""
    
    def get_review_data(self, metatext_id: int, user_id: int, session: Session) -> ReviewResponse:
        """
        Get all review data (word_list, explanations) for a specific metatext and user.
        Returns a ReviewResponse with word_list (type==word) and phrase_list (type==phrase).
        """
        # Fetch all Explanation records for this metatext and user
        explanations = list(session.exec(
            select(Explanation)
            .where((Explanation.metatext_id == metatext_id) & (Explanation.user_id == user_id))
        ).all())
        # Filter by type
        word_list = [e for e in explanations if e.type == ExplanationType.word]
        phrase_list = [e for e in explanations if e.type == ExplanationType.phrase]
        return ReviewResponse(word_list=word_list, phrase_list=phrase_list)
        
    
    def get_wordlist_for_meta_text(self, metatext_id: int, user_id: int, session: Session) -> list[Explanation]:
        """
        Retrieve the wordlist for a specific metatext, ordered by most recent first.
        
        Args:
            metatext_id: The ID of the metatext
            user_id: The ID of the user
            session: Database session
            
        Returns:
            List of WordDefinition objects
            
        Raises:
            WordlistNotFoundError: If no words are found for the metatext
        """
        logger.info(f"Retrieving wordlist for metatext_id={metatext_id}, user_id={user_id}")
        from backend.models import Metatext
        wordlist = list(session.exec(
            select(Explanation)
            .join(Metatext)
            .where((Explanation.metatext_id == metatext_id) & (Metatext.user_id == user_id))
            .order_by(desc(Explanation.id))
        ).all())
        if not wordlist:
            logger.warning(f"No words found in wordlist for metatext_id={metatext_id}, user_id={user_id}")
            raise WordlistNotFoundError(metatext_id)
        logger.info(f"Found {len(wordlist)} words in wordlist for metatext_id={metatext_id}, user_id={user_id}")
        return wordlist
    
    def get_chunk_summaries_and_notes(self, metatext_id: int, user_id: int, session: Session) -> list[Chunk]:
        """
        Retrieve chunks with summaries and note for a specific metatext, ordered by position.
        
        Args:
            metatext_id: The ID of the metatext
            user_id: The ID of the user
            session: Database session
            
        Returns:
            List of Chunk objects with summaries and note
            
        Raises:
            ChunksNotFoundError: If no chunks are found for the metatext
        """
        logger.info(f"Retrieving chunk summaries and notes for metatext_id={metatext_id}, user_id={user_id}")
        from backend.models import Metatext
        chunks = list(session.exec(
            select(Chunk)
            .join(Metatext)
            .where((Chunk.metatext_id == metatext_id) & (Metatext.user_id == user_id))
            .order_by(Chunk.position)  # type: ignore
        ).all())
        if not chunks:
            logger.warning(f"No chunks found for metatext_id={metatext_id}, user_id={user_id}")
            raise ChunksNotFoundError(metatext_id)
        logger.info(f"Found {len(chunks)} chunks for metatext_id={metatext_id}, user_id={user_id}")
        return chunks
    
    def get_wordlist_summary(self, metatext_id: int, user_id: int, session: Session) -> dict:
        """
        Get a summary of the wordlist for a metatext.
        
        Args:
            metatext_id: The ID of the metatext
            user_id: The ID of the user
            session: Database session
            
        Returns:
            Dictionary with wordlist statistics
        """
        logger.info(f"Getting wordlist summary for metatext_id={metatext_id}, user_id={user_id}")
        try:
            wordlist = self.get_wordlist_for_meta_text(metatext_id, user_id, session)
            total_words = len(wordlist)
            unique_words = len(set(word.words.lower() for word in wordlist))
            logger.info(f"Wordlist summary for metatext_id={metatext_id}, user_id={user_id}: {total_words} total, {unique_words} unique")
            return {
                "metatext_id": metatext_id,
                "user_id": user_id,
                "total_words": total_words,
                "unique_words": unique_words,
                "most_recent_word": wordlist[0].words if wordlist else None
            }
        except WordlistNotFoundError:
            return {
                "metatext_id": metatext_id,
                "user_id": user_id,
                "total_words": 0,
                "unique_words": 0,
                "most_recent_word": None
            }
    
    def get_chunks_summary(self, metatext_id: int, user_id: int, session: Session) -> dict:
        """
        Get a summary of chunks for a metatext.
        
        Args:
            metatext_id: The ID of the metatext
            user_id: The ID of the user
            session: Database session
            
        Returns:
            Dictionary with chunk statistics
        """
        logger.info(f"Getting chunks summary for metatext_id={metatext_id}, user_id={user_id}")
        try:
            chunks = self.get_chunk_summaries_and_notes(metatext_id, user_id, session)
            total_chunks = len(chunks)
            chunks_with_summaries = sum(1 for chunk in chunks if chunk.summary)
            chunks_with_notes = sum(1 for chunk in chunks if chunk.note)
            chunks_with_comparison = sum(1 for chunk in chunks if chunk.evaluation)
            logger.info(f"Chunks summary for metatext_id={metatext_id}, user_id={user_id}: {total_chunks} total, "
                       f"{chunks_with_summaries} with summaries, {chunks_with_notes} with notes")
            return {
                "metatext_id": metatext_id,
                "user_id": user_id,
                "total_chunks": total_chunks,
                "chunks_with_summaries": chunks_with_summaries,
                "chunks_with_notes": chunks_with_notes,
                "chunks_with_comparison": chunks_with_comparison,
                "completion_percentage": {
                    "summaries": (chunks_with_summaries / total_chunks * 100) if total_chunks > 0 else 0,
                    "note": (chunks_with_notes / total_chunks * 100) if total_chunks > 0 else 0,
                    "evaluation": (chunks_with_comparison / total_chunks * 100) if total_chunks > 0 else 0
                }
            }
        except ChunksNotFoundError:
            return {
                "metatext_id": metatext_id,
                "user_id": user_id,
                "total_chunks": 0,
                "chunks_with_summaries": 0,
                "chunks_with_notes": 0,
                "chunks_with_comparison": 0,
                "completion_percentage": {
                    "summaries": 0,
                    "note": 0,
                    "evaluation": 0
                }
            }
    
    def get_phrase_explanations(self, metatext_id: int, user_id: int, session: Session) -> list[Explanation]:
        """
        Retrieve all phrase explanations for a specific metatext.
        
        Args:
            metatext_id: The ID of the metatext
            user_id: The ID of the user
            session: Database session
            
        Returns:
            List of PhraseExplanation objects
        """
        logger.info(f"Retrieving phrase explanations for metatext_id={metatext_id}, user_id={user_id}")
        # from backend.models import Metatext
        phrase_explanations = list(session.exec(
            select(Explanation)
            .join(Metatext)
            .where((Explanation.metatext_id == metatext_id) & (Metatext.user_id == user_id))
        ).all())
        logger.info(f"Found {len(phrase_explanations)} phrase explanations for metatext_id={metatext_id}, user_id={user_id}")
        return phrase_explanations
