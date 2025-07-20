// Document types for the Metatext application

// Source Document types
// Types for listing, detailing, and creating source documents
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

export type SourceDocumentUpdate = {
    title?: string;
    author?: string | null;
    summary?: string | null;
    characters?: string | null;
    locations?: string | null;
    themes?: string | null;
    symbols?: string | null;
    text?: string;
};


// Meta Text types
// Types for listing, detailing, and creating meta texts
export type MetatextSummary = {
    id: number;
    title: string;
    source_document_id: number;
};

export type MetatextDetail = MetatextSummary & {
    text: string;
    chunks: ChunkType[];
};

export type MetatextCreate = {
    sourceDocId: number;
    title: string;
};



export type ChunkType = {
    id: number;
    text: string;
    position: number;
    note: string;
    summary: string;
    evaluation: string;
    explanation: string;
    metatext_id: number;
    images: AiImage[];
    rewrites: Rewrite[];
    favorited_by_user_id?: number | null;
};

export type AiImage = {
    id: number;
    prompt: string;
    path: string;
    chunk_id: number;
};

export interface Rewrite {
    id: number;
    title: string;
    rewrite_text: string;
    chunk_id: number;
}

export interface RewriteCreate {
    title: string;
    rewrite_text: string;
    chunk_id?: number;
}

export type UpdateChunkFieldFn = (
    chunkId: number,
    field: keyof ChunkType,
    value: string
) => void;

