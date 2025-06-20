"""Custom exceptions for review operations."""


class ReviewServiceError(Exception):
    """Base exception for review service errors."""
    pass


class WordlistNotFoundError(ReviewServiceError):
    """Raised when no words are found in the wordlist for a meta-text."""
    
    def __init__(self, meta_text_id: int):
        self.meta_text_id = meta_text_id
        super().__init__(f"No words found in wordlist for meta_text_id={meta_text_id}")


class ChunksNotFoundError(ReviewServiceError):
    """Raised when no chunks are found for a meta-text."""
    
    def __init__(self, meta_text_id: int):
        self.meta_text_id = meta_text_id
        super().__init__(f"No chunks found for meta_text_id={meta_text_id}")


class MetaTextNotFoundError(ReviewServiceError):
    """Raised when a meta-text is not found during review operations."""
    
    def __init__(self, meta_text_id: int):
        self.meta_text_id = meta_text_id
        super().__init__(f"Meta-text not found: id={meta_text_id}")
