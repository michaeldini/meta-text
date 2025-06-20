"""Text processing service for document content."""


class TextProcessingService:
    """Service for handling text processing operations."""
    
    @staticmethod
    def extract_between_stars(text: str) -> str:
        """
        Extracts the text between the first two lines that start with '***'.
        Returns the trimmed text, or the original text if not found.
        """
        lines = text.splitlines()
        start_idx = end_idx = None
        
        for idx, line in enumerate(lines):
            if line.strip().startswith('***'):
                if start_idx is None:
                    start_idx = idx
                elif end_idx is None:
                    end_idx = idx
                    break
        
        if start_idx is not None and end_idx is not None and end_idx > start_idx:
            # Extract lines between the two markers (exclusive)
            return '\n'.join(lines[start_idx + 1:end_idx]).strip()
        
        return text
    
    @staticmethod
    async def process_uploaded_file(file) -> str:
        """
        Process an uploaded file and extract text content.
        
        Args:
            file: FastAPI UploadFile object
            
        Returns:
            Processed text content
        """
        text = (await file.read()).decode("utf-8")
        return TextProcessingService.extract_between_stars(text)
