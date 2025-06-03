- This project is a monorepo with a Vite + React + Material UI frontend with a FastApi + SQLModel + sqlite backend. 
- the frontend uses Material UI when possible for a consistent and modern design.
- uv is used to manage python dependencies.
- The frontend is structured to support a scalable and maintainable architecture. Separate folders for assets, components, features, hooks, layouts, pages, routes, services, store, styles, and utils.
- Focus on clean, modern UI and efficient state management in the frontend.
- Always use FastAPI best practices. Use the FastAPI test client for testing API endpoints.
- The purpose of the app is to provide a user-friendly interface for managing and interacting with a document.

## FastAPI Guidelines
- use .model_dump() to convert SQLModel models to dictionaries instead of .dict().

Example:
`model.model_dump()`

## uv Guidelines
- always install new packages in the uv environment: `source .venv/bin/activate &&`
- use `uv add package_name` to add a new package.


