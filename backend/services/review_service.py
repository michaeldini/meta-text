"""Review service for managing wordlists and chunk summaries."""
from sqlmodel import select, Session, desc
from loguru import logger

from backend.models import WordDefinition, Chunk
from backend.exceptions.review_exceptions import (
    WordlistNotFoundError,
    ChunksNotFoundError
)


class ReviewService:
    """Service for review-related operations like wordlists and chunk summaries."""
    
    def get_wordlist_for_meta_text(self, meta_text_id: int, session: Session) -> list[WordDefinition]:
        """
        Retrieve the wordlist for a specific meta-text, ordered by most recent first.
        
        Args:
            meta_text_id: The ID of the meta-text
            session: Database session
            
        Returns:
            List of WordDefinition objects
            
        Raises:
            WordlistNotFoundError: If no words are found for the meta-text
        """
        logger.info(f"Retrieving wordlist for meta_text_id={meta_text_id}")
        
        wordlist = list(session.exec(
            select(WordDefinition)
            .where(WordDefinition.meta_text_id == meta_text_id)
            .order_by(desc(WordDefinition.id))
        ).all())
        
        if not wordlist:
            logger.warning(f"No words found in wordlist for meta_text_id={meta_text_id}")
            raise WordlistNotFoundError(meta_text_id)
        
        logger.info(f"Found {len(wordlist)} words in wordlist for meta_text_id={meta_text_id}")
        return wordlist
    
    def get_chunk_summaries_and_notes(self, meta_text_id: int, session: Session) -> list[Chunk]:
        """
        Retrieve chunks with summaries and notes for a specific meta-text, ordered by position.
        
        Args:
            meta_text_id: The ID of the meta-text
            session: Database session
            
        Returns:
            List of Chunk objects with summaries and notes
            
        Raises:
            ChunksNotFoundError: If no chunks are found for the meta-text
        """
        logger.info(f"Retrieving chunk summaries and notes for meta_text_id={meta_text_id}")
        
        chunks = list(session.exec(
            select(Chunk)
            .where(Chunk.meta_text_id == meta_text_id)
            .order_by(Chunk.position)  # type: ignore
        ).all())
        
        if not chunks:
            logger.warning(f"No chunks found for meta_text_id={meta_text_id}")
            raise ChunksNotFoundError(meta_text_id)
        
        logger.info(f"Found {len(chunks)} chunks for meta_text_id={meta_text_id}")
        return chunks
    
    def get_wordlist_summary(self, meta_text_id: int, session: Session) -> dict:
        """
        Get a summary of the wordlist for a meta-text.
        
        Args:
            meta_text_id: The ID of the meta-text
            session: Database session
            
        Returns:
            Dictionary with wordlist statistics
        """
        logger.info(f"Getting wordlist summary for meta_text_id={meta_text_id}")
        
        try:
            wordlist = self.get_wordlist_for_meta_text(meta_text_id, session)
            
            # Calculate some basic statistics
            total_words = len(wordlist)
            unique_words = len(set(word.word.lower() for word in wordlist))
            
            logger.info(f"Wordlist summary for meta_text_id={meta_text_id}: {total_words} total, {unique_words} unique")
            
            return {
                "meta_text_id": meta_text_id,
                "total_words": total_words,
                "unique_words": unique_words,
                "most_recent_word": wordlist[0].word if wordlist else None
            }
        except WordlistNotFoundError:
            return {
                "meta_text_id": meta_text_id,
                "total_words": 0,
                "unique_words": 0,
                "most_recent_word": None
            }
    
    def get_chunks_summary(self, meta_text_id: int, session: Session) -> dict:
        """
        Get a summary of chunks for a meta-text.
        
        Args:
            meta_text_id: The ID of the meta-text
            session: Database session
            
        Returns:
            Dictionary with chunk statistics
        """
        logger.info(f"Getting chunks summary for meta_text_id={meta_text_id}")
        
        try:
            chunks = self.get_chunk_summaries_and_notes(meta_text_id, session)
            
            # Calculate statistics
            total_chunks = len(chunks)
            chunks_with_summaries = sum(1 for chunk in chunks if chunk.summary)
            chunks_with_notes = sum(1 for chunk in chunks if chunk.notes)
            chunks_with_comparison = sum(1 for chunk in chunks if chunk.comparison)
            
            logger.info(f"Chunks summary for meta_text_id={meta_text_id}: {total_chunks} total, "
                       f"{chunks_with_summaries} with summaries, {chunks_with_notes} with notes")
            
            return {
                "meta_text_id": meta_text_id,
                "total_chunks": total_chunks,
                "chunks_with_summaries": chunks_with_summaries,
                "chunks_with_notes": chunks_with_notes,
                "chunks_with_comparison": chunks_with_comparison,
                "completion_percentage": {
                    "summaries": (chunks_with_summaries / total_chunks * 100) if total_chunks > 0 else 0,
                    "notes": (chunks_with_notes / total_chunks * 100) if total_chunks > 0 else 0,
                    "comparison": (chunks_with_comparison / total_chunks * 100) if total_chunks > 0 else 0
                }
            }
        except ChunksNotFoundError:
            return {
                "meta_text_id": meta_text_id,
                "total_chunks": 0,
                "chunks_with_summaries": 0,
                "chunks_with_notes": 0,
                "chunks_with_comparison": 0,
                "completion_percentage": {
                    "summaries": 0,
                    "notes": 0,
                    "comparison": 0
                }
            }
