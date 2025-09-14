# Project Overview
This is a monorepo containing a full-stack application with a React frontend and FastAPI backend.
The codebase uses modern best practices, but prioritizes readability, maintainability, and a clean user interface over complexity.
App purpose: User-friendly interface for managing and interacting with documents

## Frontend Stack
- Build System: Vite
- Framework: React with TypeScript
- State Management: Zustand and React Query
- UI Library: Stitches and Radix UI
- Styling: CSS-in-JS with Stitches. Import using the alias '@stitches'
- Icons: React Heroicons
- Design for tablet and mobile.
- Location: `src/` folder
- Logging: `src/utils/logger.ts`

## Backend Stack
- Framework: FastAPI with SQLModel
- Database: SQLite
- Migrations: Alembic
- Testing: pytest with FastAPI test client
- Location: `backend/` folder
- Logging: loguru

## Python Dependency Management (uv)
- Activate virtual environment: `source .venv/bin/activate`
- Add new packages: `uv add package_name`