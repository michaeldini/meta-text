"""Test runner for API tests with proper OpenAI mocking."""
import os
import sys
import pytest
from unittest.mock import patch

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)


class MockOpenAIClient:
    """Mock OpenAI client for testing."""
    
    def __init__(self, *args, **kwargs):
        pass
    
    class chat:
        class completions:
            @staticmethod
            def create(*args, **kwargs):
                # Mock response structure
                class MockChoice:
                    class message:
                        content = '{"definition": "test definition", "definitionWithContext": "test contextual definition"}'
                
                class MockResponse:
                    choices = [MockChoice()]
                
                return MockResponse()
    
    class images:
        @staticmethod
        def generate(*args, **kwargs):
            # Mock image generation response
            class MockImageData:
                url = 'https://example.com/test-image.jpg'
            
            class MockImageResponse:
                data = [MockImageData()]
            
            return MockImageResponse()


def run_api_tests():
    """Run all API tests with proper mocking."""
    
    # Mock OpenAI client globally
    with patch('backend.services.openai_service.OpenAI', MockOpenAIClient):
        with patch('openai.OpenAI', MockOpenAIClient):
            # Run pytest with the tests directory
            test_files = [
                'backend/tests/test_api_ai.py',
                'backend/tests/test_api_auth.py', 
                'backend/tests/test_api_chunks.py',
                'backend/tests/test_api_logs.py',
                'backend/tests/test_api_meta_text.py',
                'backend/tests/test_api_review.py',
                'backend/tests/test_api_source_documents.py'
            ]
            
            # Run with verbose output and coverage
            pytest_args = [
                '-v',
                '--tb=short',
                '--durations=10',
                '--cov=backend/api',
                '--cov-report=term-missing',
                '--cov-report=html:coverage/api_coverage',
            ] + test_files
            
            return pytest.main(pytest_args)


if __name__ == '__main__':
    exit_code = run_api_tests()
    sys.exit(exit_code)
