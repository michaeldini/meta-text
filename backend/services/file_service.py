"""File service for handling file operations."""
import os
import base64
import binascii
import datetime
from loguru import logger

from backend.exceptions.ai_exceptions import FileOperationError


class FileService:
    """Service for file operations."""
    
    def __init__(self, base_output_dir: str = "../../public/generated_images"):
        """
        Initialize file service.
        
        Args:
            base_output_dir: Base directory for saving files relative to the API directory
        """
        self.base_output_dir = base_output_dir
    
    def save_base64_image(self, b64_data: str, output_dir: str | None = None) -> str:
        """
        Decode base64 image data and save to output directory.
        
        Args:
            b64_data: Base64 encoded image data
            output_dir: Output directory (uses default if None)
            
        Returns:
            Relative path to saved image
            
        Raises:
            FileOperationError: If saving the image fails
        """
        if output_dir is None:
            output_dir = self.base_output_dir
            
        try:
            # Generate unique filename with timestamp
            timestamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d%H%M%S%f")
            filename = f"ai_image_{timestamp}.png"
            rel_path = f"generated_images/{filename}"
            
            # Construct absolute path relative to the API directory
            abs_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), 
                "api",
                output_dir, 
                filename
            )
            
            logger.debug(f"Saving image to: {abs_path}")
            
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(abs_path), exist_ok=True)
            
            # Decode and save image
            image_data = base64.b64decode(b64_data)
            with open(abs_path, "wb") as f:
                f.write(image_data)
            
            logger.info(f"Image saved successfully: {rel_path}")
            return rel_path
            
        except binascii.Error as e:
            logger.error(f"Invalid base64 data: {e}")
            raise FileOperationError("save", filename, f"Invalid base64 data: {e}")
        except OSError as e:
            logger.error(f"File system error saving image: {e}")
            raise FileOperationError("save", filename, f"File system error: {e}")
        except Exception as e:
            logger.error(f"Unexpected error saving image: {e}")
            raise FileOperationError("save", filename, f"Unexpected error: {e}")
