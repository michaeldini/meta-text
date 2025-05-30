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
