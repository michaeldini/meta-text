"""Custom exceptions for review operations."""


class ReviewServiceError(Exception):
    """Base exception for review service errors."""
    pass


class WordlistNotFoundError(ReviewServiceError):
    """Raised when no words are found in the wordlist for a metatext."""
    
    def __init__(self, metatext_id: int):
        self.metatext_id = metatext_id
        super().__init__(f"No words found in wordlist for metatext_id={metatext_id}")


class ChunksNotFoundError(ReviewServiceError):
    """Raised when no chunks are found for a metatext."""
    
    def __init__(self, metatext_id: int):
        self.metatext_id = metatext_id
        super().__init__(f"No chunks found for metatext_id={metatext_id}")


class MetaTextNotFoundError(ReviewServiceError):
    """Raised when a metatext is not found during review operations."""
    
    def __init__(self, metatext_id: int):
        self.metatext_id = metatext_id
        super().__init__(f"Meta-text not found: id={metatext_id}")
