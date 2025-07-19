"""Custom exceptions for metatext operations."""


class MetatextServiceError(Exception):
    """Base exception for metatext service errors."""
    pass


class SourceDocumentNotFoundError(MetatextServiceError):
    """Raised when a source document is not found."""
    
    def __init__(self, source_doc_id: int):
        self.source_doc_id = source_doc_id
        super().__init__(f"Source document not found: id={source_doc_id}")


class MetatextNotFoundError(MetatextServiceError):
    """Raised when a metatext is not found."""
    
    def __init__(self, metatext_id: int):
        self.metatext_id = metatext_id
        super().__init__(f"Meta-text not found: id={metatext_id}")


class MetatextTitleExistsError(MetatextServiceError):
    """Raised when trying to create a metatext with an existing title."""
    
    def __init__(self, title: str):
        self.title = title
        super().__init__(f"Meta-text title already exists: {title}")


class MetatextCreationError(MetatextServiceError):
    """Raised when metatext creation fails."""
    pass
