# Project Overview
This is a monorepo containing a full-stack application with a React frontend and FastAPI backend.
The codebase uses modern best practices, but prioritizes readability, maintainability, and a clean user interface over complexity.

## Frontend Stack
- Build System: Vite
- Framework: React with TypeScript
- State Management: Zustand and React Query
- UI Library: Chakra UI v3
- Icons: Heroicons
- Design for tablet and mobile.
- Testing: Vitest (tests colocated with components)
- Location: `src/` folder
- Logging: `src/utils/logger.ts`

### Documentation
- Write brief comments at the top of each file explaining its purpose
- Comment complex logic or non-obvious code sections


## Backend Stack
- Framework: FastAPI with SQLModel
- Database: SQLite
- Migrations: Alembic
- Testing: pytest with FastAPI test client
- Location: `backend/` folder
- Logging: loguru

## Development Guidelines
- Focus on clean, maintainable UI and efficient state management in the frontend
- Follow FastAPI + SQLModel best practices for robust and maintainable backend
- App purpose: User-friendly interface for managing and interacting with documents

## Python Dependency Management (uv)
- Activate virtual environment: `source .venv/bin/activate`
- Add new packages: `uv add package_name`