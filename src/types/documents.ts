// Consolidated types for document-related entities



// Shared DocType enum for use across the app
export enum DocType {
    SourceDoc = 'sourceDoc',
    MetaText = 'metaText'
}

export type MetaText = {
    id: number;
    title: string;
    source_document_id: number;
    text?: string;
};

export type SourceDocument = {
    id: number;
    title: string;
    author?: string | null;
    summary?: string | null;
    characters?: string | null;
    locations?: string | null;
    themes?: string | null;
    symbols?: string | null;
    text?: string;
};

export type Chunk = {
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
