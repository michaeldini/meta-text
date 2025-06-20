"""OpenAI service for handling AI operations."""
import os
import json
from typing import Any, Optional
from openai import OpenAI
from loguru import logger

from backend.exceptions.ai_exceptions import (
    OpenAIClientError,
    OpenAIResponseParsingError,
    OpenAIImageGenerationError,
    InstructionsFileNotFoundError
)


class OpenAIService:
    """Service for OpenAI API operations."""
    
    def __init__(self, client: Optional[OpenAI] = None):
        """Initialize OpenAI service with optional client injection."""
        self.client = client or OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.default_model = "gpt-4o-mini-2024-07-18"
        self.image_model = "dall-e-3"
    
    def read_instructions_file(self, filename: str) -> str:
        """
        Read and return the contents of an instructions file.
        
        Args:
            filename: Path to instructions file relative to the backend directory
            
        Returns:
            Contents of the instructions file
            
        Raises:
            InstructionsFileNotFoundError: If the file cannot be found or read
        """
        try:
            # Construct path relative to the backend directory
            instructions_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), 
                filename
            )
            logger.debug(f"Reading instructions file: {instructions_path}")
            
            with open(instructions_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            logger.debug(f"Successfully read instructions file: {filename}")
            return content
            
        except FileNotFoundError:
            logger.error(f"Instructions file not found: {filename}")
            raise InstructionsFileNotFoundError(filename)
        except Exception as e:
            logger.error(f"Error reading instructions file {filename}: {e}")
            raise InstructionsFileNotFoundError(filename, str(e))
    
    def extract_error_message(self, exception: Exception) -> Optional[str]:
        """
        Extract a detailed error message from an OpenAI exception.
        
        Args:
            exception: The exception to extract message from
            
        Returns:
            Extracted error message or None if extraction fails
        """
        if hasattr(exception, 'args') and exception.args:
            arg0 = exception.args[0]
            try:
                if isinstance(arg0, dict):
                    error_json = arg0
                elif isinstance(arg0, str):
                    error_json = json.loads(arg0)
                else:
                    error_json = None
                    
                if error_json and 'error' in error_json and error_json['error'].get('message'):
                    return error_json['error']['message']
            except Exception:
                pass
        return None
    
    def generate_text_response(self, instructions_file: str, prompt: str) -> str:
        """
        Generate text response using OpenAI API.
        
        Args:
            instructions_file: Path to instructions file
            prompt: Input prompt for the AI
            
        Returns:
            Generated text response
            
        Raises:
            OpenAIClientError: If API call fails
            InstructionsFileNotFoundError: If instructions file cannot be read
        """
        logger.debug(f"Generating text response with instructions: {instructions_file}")
        
        try:
            instructions = self.read_instructions_file(instructions_file)
            
            response = self.client.responses.create(
                model=self.default_model,
                instructions=instructions,
                input=prompt,
            )
            
            result = response.output_text
            logger.debug("Text response generated successfully")
            return result
            
        except Exception as e:
            logger.error(f"OpenAI text generation error: {e}")
            error_message = self.extract_error_message(e)
            raise OpenAIClientError(error_message or str(e))
    
    def generate_parsed_response(self, instructions_file: str, prompt: str, response_format: type) -> Any:
        """
        Generate and parse structured response using OpenAI API.
        
        Args:
            instructions_file: Path to instructions file
            prompt: Input prompt for the AI
            response_format: Pydantic model class for parsing response
            
        Returns:
            Parsed response object
            
        Raises:
            OpenAIClientError: If API call fails
            OpenAIResponseParsingError: If response parsing fails
            InstructionsFileNotFoundError: If instructions file cannot be read
        """
        logger.debug(f"Generating parsed response with format: {response_format.__name__}")
        
        try:
            instructions = self.read_instructions_file(instructions_file)
            
            response = self.client.responses.parse(
                model=self.default_model,
                instructions=instructions,
                input=prompt,
                text_format=response_format,
            )
            
            if response.output_parsed is None:
                logger.error("Failed to parse AI response")
                raise OpenAIResponseParsingError(response_format.__name__)
            
            logger.debug("Parsed response generated successfully")
            return response.output_parsed
            
        except OpenAIResponseParsingError:
            raise
        except Exception as e:
            logger.error(f"OpenAI parsed response generation error: {e}")
            error_message = self.extract_error_message(e)
            raise OpenAIClientError(error_message or str(e))
    
    def generate_image(self, prompt: str, size: str = "1024x1024", style: str = "natural") -> str:
        """
        Generate image using DALL-E API.
        
        Args:
            prompt: Text prompt for image generation
            size: Image size (default: "1024x1024")
            style: Image style (default: "natural")
            
        Returns:
            Base64 encoded image data
            
        Raises:
            OpenAIImageGenerationError: If image generation fails
        """
        logger.debug(f"Generating image for prompt: '{prompt[:50]}...'")
        
        # Type-safe size parameter
        valid_sizes = ["256x256", "512x512", "1024x1024", "1024x1536", "1536x1024", "1792x1024", "1024x1792"]
        if size not in valid_sizes:
            size = "1024x1024"
        
        # Type-safe style parameter  
        valid_styles = ["natural", "vivid"]
        if style not in valid_styles:
            style = "natural"
        
        try:
            response = self.client.images.generate(
                model=self.image_model,
                prompt=prompt,
                n=1,
                size=size,  # type: ignore
                response_format="b64_json",
                style=style,  # type: ignore
            )
            
            if not response.data or not hasattr(response.data[0], "b64_json") or not response.data[0].b64_json:
                logger.error("No image data returned from OpenAI")
                raise OpenAIImageGenerationError("No image data returned from OpenAI")
            
            logger.debug("Image generated successfully")
            return response.data[0].b64_json
            
        except OpenAIImageGenerationError:
            raise
        except Exception as e:
            logger.error(f"OpenAI image generation error: {e}")
            error_message = self.extract_error_message(e)
            raise OpenAIImageGenerationError(error_message or str(e))
