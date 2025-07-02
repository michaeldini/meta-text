// Consolidated types for document-related entities



// Shared DocType enum for use across the app
export enum DocType {
    SourceDoc = 'sourceDoc',
    MetaText = 'metaText'
}

export enum ViewMode {
    Search = 'search',
    Create = 'create'
}

// export type MetaText = {
//     id: number;
//     title: string;
//     source_document_id: number;
//     text?: string;
// };

// export type SourceDocument = {
//     id: number;
//     title: string;
//     author?: string | null;
//     summary?: string | null;
//     characters?: string | null;
//     locations?: string | null;
//     themes?: string | null;
//     symbols?: string | null;
//     text?: string;
// };

// MetaText types
export type MetaTextSummary = {
    id: number;
    title: string;
    source_document_id: number;
};

export type MetaTextDetail = MetaTextSummary & {
    text: string;
    chunks: ChunkType[];
};
export type MetaTextCreate = {
    sourceDocId: number;
    title: string;
};

// SourceDocument types
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

export type SourceDocumentDetail = SourceDocumentSummary & {
    text: string;
};
export type SourceDocumentCreate = {
    title: string;
    file: File;
};

// Chunk types
export type ChunkType = {
    id: number;
    text: string;
    position: number;
    notes: string;
    summary: string;
    comparison: string;
    explanation?: string;
    meta_text_id: number;
    ai_images?: AiImage[];
};

export type AiImage = {
    id: number;
    prompt: string;
    path: string;
    chunk_id: number;
};

export interface ChunkCompression {
    id: number;
    title: string; // e.g., "like im 5", "like a bro"
    compressed_text: string;
    chunk_id: number;
}

export interface ChunkCompressionCreate {
    title: string;
    compressed_text: string;
    chunk_id?: number; // optional for creation, will be set by backend
}

// Type for chunk field values - covers all possible field types
export type ChunkFieldValue = string | number | boolean | null | undefined;
