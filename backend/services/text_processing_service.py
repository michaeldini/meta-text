"""Text processing service for document content."""


from typing import TypedDict

class ProcessedTextResult(TypedDict):
    text: str
    author: str | None

class TextProcessingService:
    """Service for handling text processing operations."""

    @staticmethod
    def extract_between_project_gutenberg_stars(text: str) -> str:
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
    def extract_author_from_text(text: str) -> str | None:
        """
        Attempt to extract the author's name from the text.
        Looks for a line starting with 'author:' (case-insensitive).
        Returns the author's name if found, else None.
        """
        import re
        match = re.search(r'^[ \t]*author[ \t]*[:\-][ \t]*(.+)$', text, re.IGNORECASE | re.MULTILINE)
        if match:
            return match.group(1).strip()
        return None

    @staticmethod
    async def process_uploaded_file(file) -> ProcessedTextResult:
        """
        Process an uploaded file and extract text content and metadata.

        Args:
            file: FastAPI UploadFile object

        Returns:
            Dict with processed text and extracted author (if any)
        """
        text = (await file.read()).decode("utf-8")
        author = TextProcessingService.extract_author_from_text(text)
        processed_text = TextProcessingService.extract_between_project_gutenberg_stars(text)
        return {"text": processed_text, "author": author}
