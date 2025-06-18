- This project is a monorepo with a Vite + typescript + React + Material UI frontend with a FastApi + SQLModel + sqlite backend. 
- the frontend uses Material UI when possible for a consistent and modern design.
- uv is used to manage python dependencies.
- The frontend is structured to support a scalable and maintainable architecture. Separate folders for assets, components, features, hooks, layouts, pages, routes, services, store, styles, and utils.
- Focus on clean, modern UI and efficient state management in the frontend.
- Always use FastAPI + SQLModel best practices to create a robust and easy to maintain backend.
- Use the FastAPI test client for testing API endpoints.
- The purpose of the app is to provide a user-friendly interface for managing and interacting with a document.
- loguru is used for logging in the backend.
- src/utils/logger.ts is used for logging in the frontend.
- pytest is used for testing in the backend.
- vitetest is used for testing in the frontend. tests are colocated with the component being tested.
## uv Guidelines
- use `source .venv/bin/activate` before installing new python packages.
- use `uv add package_name` to add a new package.


