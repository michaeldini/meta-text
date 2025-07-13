"""Configuration constants for the application."""

# Text chunking configuration

class BackendConfig:
    """Configuration for the backend application."""
    
    # consider moving database connection settings to this file.

    DEFAULT_CHUNK_SIZE: int = 500  # Default chunk size when breaking up a metatext for the first time

    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB # Maximum file size for source document uploads

    ALLOWED_EXTENSIONS: set[str] = {".txt"}  # Allowed file extensions for source document uploads