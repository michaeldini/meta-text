"""Custom exceptions for chunk operations."""


class ChunkServiceError(Exception):
    """Base exception for chunk service errors."""
    pass


class ChunkNotFoundError(ChunkServiceError):
    """Raised when a chunk is not found."""
    
    def __init__(self, chunk_id: int):
        self.chunk_id = chunk_id
        super().__init__(f"Chunk not found: id={chunk_id}")


class InvalidSplitIndexError(ChunkServiceError):
    """Raised when an invalid split index is provided."""
    
    def __init__(self, chunk_id: int, word_index: int, max_words: int):
        self.chunk_id = chunk_id
        self.word_index = word_index
        self.max_words = max_words
        super().__init__(f"Invalid split index {word_index} for chunk {chunk_id} (max words: {max_words})")


class ChunkCombineError(ChunkServiceError):
    """Raised when chunk combination fails."""
    
    def __init__(self, first_chunk_id: int, second_chunk_id: int | None, reason: str):
        self.first_chunk_id = first_chunk_id
        self.second_chunk_id = second_chunk_id
        self.reason = reason
        super().__init__(f"Cannot combine chunks {first_chunk_id} and {second_chunk_id}: {reason}")


class ChunkUpdateError(ChunkServiceError):
    """Raised when chunk update fails."""
    
    def __init__(self, chunk_id: int, reason: str):
        self.chunk_id = chunk_id
        self.reason = reason
        super().__init__(f"Cannot update chunk {chunk_id}: {reason}")
