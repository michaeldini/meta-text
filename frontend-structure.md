# Frontend Component Structure

## Pages (`src/pages/`)

### Auth

- **AuthGate.tsx**: Protects routes, renders children if authenticated, otherwise shows `LoginPage`.
- **LoginPage.tsx**: Login form using Material UI, handles authentication and navigation.
- **RegisterPage.tsx**: Registration form using Material UI, handles user registration and navigation.

### MetaTextPage

- **MetaTextPage.tsx**: Main page for listing and creating MetaText documents. Uses:
  - `PageContainer`, `SearchableList`, `MetaTextCreateForm`
  - Hooks: `useSourceDocuments`, `useMetaTexts`
  - Handles navigation, error/loading boundaries, and logging.
- **MetaTextDetailPage.tsx**: Shows details for a single MetaText document. Uses:
  - `SourceDocInfo`, `Chunks` (feature), `PageContainer`
  - Hooks: `useMetaTextDetail`
  - Handles error/loading boundaries and logging.
- **MetaTextReviewPage.tsx**: Review page for a MetaText document. Uses:
  - `ChunkSummaryNotesTable` (feature), Material UI Table for wordlist
  - Fetches wordlist and chunk summaries for review.

### SourceDocPage

- **SourceDocsPage.tsx**: Lists all source documents and allows upload. Uses:
  - `PageContainer`, `SearchableList`, `SourceDocUploadForm`
  - Hook: `useSourceDocuments`
  - Handles deletion, error/loading boundaries, and notifications.
- **SourceDocDetailPage.tsx**: Shows details for a single source document. Uses:
  - `SourceDocInfo`, `PageContainer`
  - Hook: `useSourceDocumentDetail`
  - Handles error/loading boundaries and logging.

---

## Features

### Chunks (`src/features/Chunks/`)

- **index.tsx**: Main Chunks component, paginated list of chunks for a MetaText.
- **Chunk.tsx**: Displays a single chunk, including words, text field, image, and actions.
- **ChunkComparison.tsx**: Compares chunk summaries, allows AI generation of comparison.
- **ChunkSummaryNotesTable.tsx**: Table of chunk summaries and notes, with image display.
- **ChunkImageDisplay.tsx**: Modal/lightbox for chunk images.
- **ChunkTextField.tsx**: Material UI text field for editing chunk text.
- **ChunkWords.tsx**: Displays words in a chunk, allows word actions.
- **ToolIconButton.tsx**: Reusable icon button with tooltip.
- **WordActionDialog.tsx**: Dialog for word actions (split, fetch definition).
- **useChunksApi.hook.ts**: API hooks for chunk operations.
- **useChunksManager.hook.ts**: State management for chunks.
- **Chunks.styles.tsx**: Style objects for Chunks feature.

---

## Components (`src/components/`)

- **AiGenerationBtn.tsx / AiGenerationButton.tsx**: Button for AI-powered actions.
- **AppSuspenseFallback.tsx**: Fallback UI for suspense.
- **DeleteButton.tsx**: Button for delete actions.
- **ErrorBoundary.tsx**: Error boundary for React components.
- **FileUploadWidget.tsx**: File upload UI.
- **GeneralizedList.tsx**: Generic list component.
- **GenerateImageDialog.tsx / .jsx**: Dialog for generating images.
- **LoadingBoundary.tsx**: Loading state boundary.
- **MetaTextCreateForm.tsx**: Form for creating MetaText documents.
- **NavBar.tsx**: Top navigation bar.
- **PageContainer.tsx**: Layout container for pages.
- **SearchBar.tsx / .jsx**: Search input component.
- **SearchableList.tsx**: List with search/filter functionality.
- **SourceDocInfo.tsx**: Displays info about a source document.
- **SourceDocSelect.tsx**: Dropdown/select for source documents.
- **SourceDocUploadForm.tsx**: Form for uploading source documents.
- **icons/UndoArrowIcon.tsx**: Custom icon.

---

This structure supports a scalable, maintainable, and modern React + Material UI frontend. If you want a more detailed breakdown of any specific page or component, let me know!
