# Frontend-Backend Integration

This document outlines the integration between the frontend and backend of the MetaText application.

## Homepage

- useHomePageData: A custom hook that manages the state and data fetching for the homepage.
- useHomePageContent: A custom hook that determines the content to be displayed on the homepage based on the current state (useHomePageData variables).

### Flow for fetching data

1. The `useHomePageData` hook is called when the homepage component mounts.
2. `useHomePageData` fetches the initial data from the backend using the `fetchSourceDocs` and `fetchMetaTexts()` functions from `useDocumentsStore()`.
3. `useDocumentsStore` uses `fetchSourceDocuments` and `fetchMetaTexts` functions from `sourceDocumentService` and `metaTextService` respectively to make API calls to the backend.
4. `sourceDocumentService` calls the endpoint `/api/source-documents` to fetch source documents. `metaTextService` calls `/api/meta-text` to fetch meta texts.
5. source docs and meta texts are stored in the Zustand store, sourceDocs and metaTexts, respectively.

## Source Document Details Page

1. The `useSourceDocumentDetailStore` hook is called when the source document detail page component mounts.
2. It fetches the source document details using the `store.fetchSourceDocumentDetail(sourceDocumentId)` function from `useSourceDocumentDetailStore`.
3. `fetchSourceDocumentDetail` calls the `sourceDocumentService.fetchSourceDocument(sourceDocumentId)` function.
4. `sourceDocumentService.fetchSourceDocument` makes an API call to the backend endpoint `/api/source-documents/{sourceDocumentId}` to fetch the details of the source document.
5. The fetched source document details are stored in the Zustand store as `doc`.
