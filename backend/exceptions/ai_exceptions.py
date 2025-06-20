"""Custom exceptions for AI operations."""


class AIServiceError(Exception):
    """Base exception for AI service errors."""
    pass


class OpenAIClientError(AIServiceError):
    """Raised when OpenAI API call fails."""
    
    def __init__(self, message: str):
        self.message = message
        super().__init__(f"OpenAI API error: {message}")


class OpenAIResponseParsingError(AIServiceError):
    """Raised when OpenAI response cannot be parsed."""
    
    def __init__(self, response_format: str):
        self.response_format = response_format
        super().__init__(f"Failed to parse OpenAI response to format: {response_format}")


class OpenAIImageGenerationError(AIServiceError):
    """Raised when image generation fails."""
    
    def __init__(self, message: str):
        self.message = message
        super().__init__(f"Image generation failed: {message}")


class InstructionsFileNotFoundError(AIServiceError):
    """Raised when instructions file cannot be found or read."""
    
    def __init__(self, filename: str, reason: str = "File not found"):
        self.filename = filename
        self.reason = reason
        super().__init__(f"Instructions file error: {filename} - {reason}")


class FileOperationError(AIServiceError):
    """Raised when file operations fail."""
    
    def __init__(self, operation: str, filename: str, reason: str):
        self.operation = operation
        self.filename = filename
        self.reason = reason
        super().__init__(f"File {operation} failed for {filename}: {reason}")


class ChunkNotFoundError(AIServiceError):
    """Raised when chunk is not found."""
    
    def __init__(self, chunk_id: int):
        self.chunk_id = chunk_id
        super().__init__(f"Chunk not found: {chunk_id}")


class WordDefinitionValidationError(AIServiceError):
    """Raised when word definition request validation fails."""
    
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"Word definition validation error - {field}: {message}")


class SourceDocumentNotFoundError(AIServiceError):
    """Raised when source document is not found."""
    
    def __init__(self, doc_id: int):
        self.doc_id = doc_id
        super().__init__(f"Source document not found: {doc_id}")


class PromptValidationError(AIServiceError):
    """Raised when prompt validation fails."""
    
    def __init__(self, message: str):
        self.message = message
        super().__init__(f"Prompt validation error: {message}")
