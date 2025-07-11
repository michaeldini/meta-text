# Services

 Services are the core components of the application that handle business logic, data processing, and interactions with external systems. They are designed to be reusable and modular, allowing for easy integration and testing.

## Major Data Types that Services Use

 Services primarily interact with the following major data types:

- SourceDocument
- MetaText
- Chunk

## Source Document Services

The homepage requires a list of source documents.

This list is provided by `fetchSourceDocuments` service, which retrieves all source documents from the database and returns a list of `SourceDocumentSummary` objects.

```js
export type SourceDocumentSummary = {
    id: number;
    title: string;
    author: string | null;
    summary: string | null;
    characters: string | null;
    locations: string | null;
    themes: string | null;
    symbols: string | null;
};
```

When the user needs to view a specific source document, the `fetchSourceDocument` service is used. This service retrieves `SourceDocumentDetail` objects, which include the full text of the document along with its summary and other metadata.

```js
export type SourceDocumentDetail = SourceDocumentSummary & {
    text: string;
}
```

When the user wants to create a new source document, the `createSourceDocument` service is used. This service accepts a `SourceDocumentCreate` object, which contains the necessary fields to create a new source document.

```js
export type SourceDocumentCreate = {
    title: string;
    file: File | null;
}
```

### Where are the Source Document Services Used?

`fetchSourceDocuments` is used by `documentStore.ts`.
