# API Tests Documentation

This directory contains comprehensive test suites for all API endpoints in the meta-text backend application. The tests are designed with proper mocking, especially for external services like OpenAI.

## Test Files

### Core API Tests

- `test_api_ai.py` - Tests for AI-related endpoints (word definitions, image generation, etc.)
- `test_api_auth.py` - Tests for authentication endpoints (register, login, user info)
- `test_api_chunks.py` - Tests for chunk management endpoints
- `test_api_logs.py` - Tests for frontend logging endpoints
- `test_api_meta_text.py` - Tests for meta-text management endpoints
- `test_api_review.py` - Tests for review and wordlist endpoints
- `test_api_source_documents.py` - Tests for source document management endpoints

### Configuration Files

- `conftest.py` - Shared pytest fixtures and configuration
- `run_api_tests.py` - Test runner with proper OpenAI mocking

## Features

### Comprehensive Coverage

- **HTTP Status Codes**: Tests for success (200), client errors (400, 404, 409, 422), and server errors (500)
- **Request Validation**: Tests for missing parameters, invalid data types, and edge cases
- **Exception Handling**: Tests for all custom exceptions with proper error responses
- **Database Operations**: Mocked database sessions and service calls

### OpenAI Mocking

All tests that interact with external OpenAI APIs are properly mocked to:

- Avoid making real API calls during testing
- Ensure consistent test results
- Test error scenarios (API failures, parsing errors, etc.)
- Maintain test isolation and speed

### Test Patterns

Each test file follows consistent patterns:

1. **Setup**: Mock services and database sessions
2. **Execute**: Make API requests using FastAPI TestClient
3. **Assert**: Verify response status codes, data, and service calls

## Running Tests

### Run All API Tests

```bash
# From the backend directory
python tests/run_api_tests.py
```

### Run Specific Test Files

```bash
# Individual test files
pytest tests/test_api_ai.py -v
pytest tests/test_api_auth.py -v
pytest tests/test_api_chunks.py -v
# ... etc
```

### Run with Coverage

```bash
pytest tests/ --cov=backend/api --cov-report=html
```

## Test Categories

### 1. AI Endpoints (`test_api_ai.py`)

- **Chunk Comparison**: Tests for AI-generated chunk analysis
- **Word Definitions**: Tests for contextual word definitions
- **Source Document Info**: Tests for document analysis
- **Image Generation**: Tests for DALL-E image creation
- **Error Handling**: OpenAI client errors, response parsing failures

### 2. Authentication (`test_api_auth.py`)

- **User Registration**: Success, duplicate username, validation errors
- **User Login**: Success, invalid credentials, token generation
- **Token Validation**: Current user retrieval, invalid tokens
- **Security**: Password hashing, JWT token handling

### 3. Chunk Management (`test_api_chunks.py`)

- **CRUD Operations**: Get, update chunks with validation
- **Chunk Splitting**: Word-based chunk division with error handling
- **Chunk Combining**: Merging adjacent chunks with validation
- **Bulk Operations**: Getting all chunks for a meta-text

### 4. Logging (`test_api_logs.py`)

- **Frontend Logging**: Different log levels (error, warn, info, debug)
- **Client Information**: Host extraction and logging
- **Validation**: Required fields, proper formatting

### 5. Meta-Text Management (`test_api_meta_text.py`)

- **CRUD Operations**: Create, read, list, delete meta-texts
- **Validation**: Title uniqueness, source document existence
- **Error Handling**: Not found, creation errors, dependencies

### 6. Review System (`test_api_review.py`)

- **Wordlist Management**: Retrieval, summaries, statistics
- **Chunk Analysis**: Notes and summaries overview
- **Progress Tracking**: Completion percentages, analytics

### 7. Source Documents (`test_api_source_documents.py`)

- **File Upload**: Document creation from uploaded files
- **CRUD Operations**: List, get, delete documents
- **Dependencies**: Cascade deletion checks with meta-texts
- **File Handling**: Large files, special characters, validation

## Mocking Strategy

### Service Layer Mocking

All business logic services are mocked at the API layer:

```python
@patch('backend.api.ai.get_ai_service')
def test_endpoint(mock_service, client):
    mock_service.return_value.method.return_value = expected_result
    # Test implementation
```

### Database Session Mocking

Database sessions are mocked to avoid real database operations:

```python
@patch('backend.api.endpoint.get_session')
def test_endpoint(mock_get_session, test_session):
    mock_get_session.return_value = test_session
    # Test implementation
```

### External API Mocking

OpenAI and other external APIs are completely mocked:

```python
class MockOpenAIClient:
    # Mock implementation that returns predictable responses
```

## Best Practices

### Test Isolation

- Each test is independent and doesn't rely on other tests
- Database sessions are isolated using in-memory SQLite
- Service calls are mocked to prevent side effects

### Error Testing

- Tests cover both happy path and error scenarios
- Custom exceptions are tested with proper error messages
- HTTP status codes are verified for all error conditions

### Data Validation

- Request validation is tested with missing/invalid parameters
- Response data structure is verified
- Edge cases (empty data, special characters) are covered

### Performance

- Tests run quickly due to proper mocking
- No real database or API calls slow down execution
- Parallel execution is supported

## Contributing

When adding new API endpoints:

1. Create comprehensive tests following the existing patterns
2. Mock all external dependencies (databases, APIs, file systems)
3. Test both success and failure scenarios
4. Include parameter validation tests
5. Update this documentation

### Test Checklist for New Endpoints

- [ ] Success scenario with valid data
- [ ] All possible error scenarios (404, 400, 500, etc.)
- [ ] Parameter validation (missing, invalid types)
- [ ] Service layer mocking
- [ ] Database session mocking
- [ ] External API mocking (if applicable)
- [ ] Edge cases and boundary conditions
- [ ] Proper HTTP status codes
- [ ] Response data structure verification
