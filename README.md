# Meta-Text App

This project is a monorepo containing:

- **Frontend:** Vite + React app for interacting with a piece of text (meta-text feature coming soon)
- **Backend:** Node.js (Express) server with a JSON file as a mock database

## Getting Started

### Frontend

```sh
npm install
npm run dev
```

The frontend runs on [http://localhost:5173](http://localhost:5173) by default.

### Backend

```sh
cd backend
npm install
npm start
```

The backend runs on [http://localhost:3001](http://localhost:3001).

## Project Structure

- `/src` - React frontend source code
- `/backend` - Node.js backend and JSON database

## Next Steps

- Implement the meta-text interactive feature
- Connect frontend to backend API

## Notes

### `SourceDocsPage`

#### Components

- `SourceDocUploadForm`
- `SearchBar`
- `SourceDocumentList`

### `MetaTextPage`

#### Components

- `MetaTextCreateForm` component
- `SearchBar` component
- `MetaTextList` component
- `MetaTextSections` component

#### Hooks

- `useAutoSave` hook

# Guidelines

michaeldini: i want to have a better understanding of the architecture of the app. write guidelines i can follow to stick with a pattern for consistent architecture. for example, during development i might make an endpoint then make a frontend service then make a hook and then implement the hook in JSX. but my codebase is not as clean as that sounds, so i want to learn how to make it streamlined and maintainable

GitHub Copilot: Here are some practical guidelines to help you maintain a clean, consistent, and scalable architecture for your Vite + React + Material UI frontend and FastAPI + SQLModel backend monorepo:

## General Principles

- Favor clear separation of concerns: keep backend, frontend, and shared logic in their own domains.
- Use consistent naming conventions and folder structures.
- Document your endpoints, services, and hooks with concise comments.
- Prefer composition over inheritance, especially in React components and hooks.
- Write tests for both backend endpoints and frontend logic.

---

## Backend (FastAPI + SQLModel)

1. **API Structure**
   - Organize endpoints by resource in api (e.g., `chunks.py`, `meta_text.py`).
   - Use routers for each resource and include them in your main FastAPI app.
   - Keep business logic out of route handlers; use service/helper functions.

2. **Models**
   - Define SQLModel models in models.py or split by resource if large.
   - Use Pydantic models for request/response schemas if they differ from DB models.

3. **Database**
   - Centralize DB session management in db.py.
   - Use dependency injection for DB sessions in endpoints.

4. **Testing**
   - Place tests in api.
   - Use FastAPI’s TestClient for endpoint tests.
   - Use a separate test database or transaction rollbacks.

---

## Frontend (Vite + React + Material UI)

1. **Folder Structure**
   - assets: Images, icons, static files.
   - components: Reusable UI components.
   - features: Feature-specific components (e.g., Chunks, WordActionDialog).
   - hooks: Custom hooks for data fetching, state, etc.
   - pages: Page-level components (route targets).
   - services: API service modules for backend communication.
   - `src/store/`: State management (if using Redux, Zustand, etc.).
   - styles: Theme and global styles.
   - utils: Utility/helper functions.

2. **Development Flow**
   - When adding a new feature:
     1. **Backend**: Create/extend endpoint in api, update models if needed.
     2. **Frontend Service**: Add/extend a service in services to call the endpoint.
     3. **Hook**: Create a custom hook in hooks to encapsulate data fetching/mutation logic.
     4. **Component**: Use the hook in a component or page in components or pages.
     5. **UI**: Use Material UI components for consistency.
     6. **Test**: Add/extend tests in tests (backend) and components or hooks (frontend).

3. **State Management**
   - Use React context or a state library for global state.
   - Keep local state in components when possible.

4. **API Communication**
   - Centralize all API calls in services.
   - Use hooks for all data fetching/mutation; never call services directly in components.

5. **Styling**
   - Use Material UI’s theming system for consistent look and feel.
   - Place custom themes in theme.js.

---

## Best Practices

- Keep files small and focused; split large files by feature or concern.
- Refactor regularly to maintain separation and clarity.
- Use TypeScript for type safety (if possible).
- Write clear, descriptive commit messages.
- Review and update documentation as you go.

---

By following this pattern, you’ll ensure that every new feature or change follows a predictable, maintainable path from backend to frontend UI. This will make your codebase easier to navigate, test, and extend.
