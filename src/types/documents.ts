// Document types for the MetaText application

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
export type MetaTextSummary = {
    id: number;
    title: string;
    source_document_id: number;
};

export type MetaTextDetail = MetaTextSummary & {
    text: string;
    // chunks: ChunkType[];
};

export type MetaTextCreate = {
    sourceDocId: number;
    title: string;
};



export type ChunkType = {
    id: number;
    text: string;
    position: number;
    notes: string;
    summary: string;
    comparison: string;
    explanation: string;
    meta_text_id: number;
    ai_images: AiImage[];
    compressions: ChunkCompression[];
};

export type AiImage = {
    id: number;
    prompt: string;
    path: string;
    chunk_id: number;
};

export interface ChunkCompression {
    id: number;
    title: string;
    compressed_text: string;
    chunk_id: number;
}

export interface ChunkCompressionCreate {
    title: string;
    compressed_text: string;
    chunk_id?: number;
}

export type UpdateChunkFieldFn = (
    chunkId: number,
    field: keyof ChunkType,
    value: string
) => void;

