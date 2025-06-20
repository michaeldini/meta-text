"""Custom exceptions for source document operations."""


class SourceDocumentServiceError(Exception):
    """Base exception for source document service errors."""
    pass


class SourceDocumentNotFoundError(SourceDocumentServiceError):
    """Raised when a source document is not found."""
    
    def __init__(self, doc_id: int):
        self.doc_id = doc_id
        super().__init__(f"Source document not found: id={doc_id}")


class SourceDocumentTitleExistsError(SourceDocumentServiceError):
    """Raised when trying to create a source document with an existing title."""
    
    def __init__(self, title: str):
        self.title = title
        super().__init__(f"Source document title already exists: {title}")


class SourceDocumentCreationError(SourceDocumentServiceError):
    """Raised when source document creation fails."""
    pass


class SourceDocumentHasDependenciesError(SourceDocumentServiceError):
    """Raised when trying to delete a source document that has related MetaText records."""
    
    def __init__(self, doc_id: int, meta_text_count: int):
        self.doc_id = doc_id
        self.meta_text_count = meta_text_count
        super().__init__(f"Cannot delete source document {doc_id}: {meta_text_count} MetaText records exist")
