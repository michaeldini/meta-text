# Project Overview
This is a monorepo containing a full-stack application with a React frontend and FastAPI backend.
The codebase uses modern best practices, but prioritizes readability, maintainability, and a clean user interface over complexity.

## Frontend Stack
- Build System: Vite
- Framework: React with TypeScript
- State Management: Zustand
- UI Library: Material UI (use separate files for styling to keep components clean, leverage MUI's theming)
- Icons: Heroicons
- Design for tablet and mobile.
- Testing: Vitest (tests colocated with components)
- Location: `src/` folder
- Logging: `src/utils/logger.ts`

### Documentation
- Use TypeDoc for generating documentation.
- Use TypeScript's native type annotations (: boolean, <string>, etc.)
- Use JSDoc comments for documentation purposes.


## Backend Stack
- Framework: FastAPI with SQLModel
- Database: SQLite
- Migrations: Alembic
- Testing: pytest with FastAPI test client
- Location: `backend/` folder
- Logging: loguru

## Development Guidelines
- Focus on clean, modern UI and efficient state management in the frontend
- Follow FastAPI + SQLModel best practices for robust and maintainable backend
- App purpose: User-friendly interface for managing and interacting with documents

## Python Dependency Management (uv)
- Activate virtual environment: `source .venv/bin/activate`
- Add new packages: `uv add package_name`