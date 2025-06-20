"""Custom exceptions for meta-text operations."""


class MetaTextServiceError(Exception):
    """Base exception for meta-text service errors."""
    pass


class SourceDocumentNotFoundError(MetaTextServiceError):
    """Raised when a source document is not found."""
    
    def __init__(self, source_doc_id: int):
        self.source_doc_id = source_doc_id
        super().__init__(f"Source document not found: id={source_doc_id}")


class MetaTextNotFoundError(MetaTextServiceError):
    """Raised when a meta-text is not found."""
    
    def __init__(self, meta_text_id: int):
        self.meta_text_id = meta_text_id
        super().__init__(f"Meta-text not found: id={meta_text_id}")


class MetaTextTitleExistsError(MetaTextServiceError):
    """Raised when trying to create a meta-text with an existing title."""
    
    def __init__(self, title: str):
        self.title = title
        super().__init__(f"Meta-text title already exists: {title}")


class MetaTextCreationError(MetaTextServiceError):
    """Raised when meta-text creation fails."""
    pass
