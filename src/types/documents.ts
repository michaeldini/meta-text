/**
 * @fileoverview Consolidated types for document-related entities including source documents, 
 * meta texts, chunks, and their associated data structures.
 */

/**
 * Enumeration for document types in the application.
 */
export enum DocType {
    /** Source document type */
    SourceDoc = 'sourceDoc',
    /** Meta text document type */
    MetaText = 'metaText'
}

/**
 * Enumeration for view modes in the document interface.
 */
export enum ViewMode {
    /** Search mode for browsing existing documents */
    Search = 'search',
    /** Create mode for adding new documents */
    Create = 'create'
}

/**
 * Summary information for a MetaText document.
 * Contains basic metadata without the full content.
 */
export type MetaTextSummary = {
    /** Unique identifier for the meta text */
    id: number;
    /** Title of the meta text */
    title: string;
    /** ID of the associated source document */
    source_document_id: number;
};

/**
 * Detailed MetaText information including full content and associated chunks.
 * Extends MetaTextSummary with additional data.
 */
export type MetaTextDetail = MetaTextSummary & {
    /** Full text content of the meta text */
    text: string;
    /** Array of chunks associated with this meta text */
    chunks: ChunkType[];
};

/**
 * Data structure for creating a new MetaText document.
 */
export type MetaTextCreate = {
    /** ID of the source document this meta text is based on */
    sourceDocId: number;
    /** Title for the new meta text */
    title: string;
};

/**
 * Summary information for a source document.
 * Contains metadata and analysis fields without the full text content.
 */
export type SourceDocumentSummary = {
    /** Unique identifier for the source document */
    id: number;
    /** Title of the document */
    title: string;
    /** Author of the document, if known */
    author: string | null;
    /** AI-generated summary of the document content */
    summary: string | null;
    /** Characters identified in the document */
    characters: string | null;
    /** Locations mentioned in the document */
    locations: string | null;
    /** Themes present in the document */
    themes: string | null;
    /** Symbols identified in the document */
    symbols: string | null;
};

/**
 * Detailed source document information including full text content.
 * Extends SourceDocumentSummary with the complete document text.
 */
export type SourceDocumentDetail = SourceDocumentSummary & {
    /** Full text content of the source document */
    text: string;
};

/**
 * Data structure for creating a new source document.
 */
export type SourceDocumentCreate = {
    /** Title for the new source document */
    title: string;
    /** File object containing the document content */
    file: File;
};

/**
 * Represents a chunk of text within a MetaText document.
 * Contains the text content along with AI-generated analysis and associated images.
 */
export type ChunkType = {
    /** Unique identifier for the chunk */
    id: number;
    /** Text content of the chunk */
    text: string;
    /** Position of this chunk within the parent meta text */
    position: number;
    /** User or AI-generated notes about this chunk */
    notes: string;
    /** AI-generated summary of the chunk content */
    summary: string;
    /** AI-generated comparison analysis */
    comparison: string;
    /** AI-generated explanation of the chunk */
    explanation: string;
    /** ID of the parent meta text document */
    meta_text_id: number;
    /** Array of AI-generated images associated with this chunk */
    ai_images: AiImage[];
};

/**
 * Represents an AI-generated image associated with a text chunk.
 */
export type AiImage = {
    /** Unique identifier for the AI image */
    id: number;
    /** Prompt used to generate the image */
    prompt: string;
    /** File path to the generated image */
    path: string;
    /** ID of the associated chunk */
    chunk_id: number;
};

/**
 * Represents a compressed version of a chunk's text content.
 * Used for creating simplified or alternative representations of chunks.
 */
export interface ChunkCompression {
    /** Unique identifier for the compression */
    id: number;
    /** Descriptive title for the compression style (e.g., "like im 5", "like a bro") */
    title: string;
    /** The compressed/simplified text content */
    compressed_text: string;
    /** ID of the associated chunk */
    chunk_id: number;
}

/**
 * Data structure for creating a new chunk compression.
 */
export interface ChunkCompressionCreate {
    /** Descriptive title for the compression style */
    title: string;
    /** The compressed/simplified text content */
    compressed_text: string;
    /** ID of the associated chunk (optional during creation, set by backend) */
    chunk_id?: number;
}

/**
 * Function type for updating a specific field of a chunk.
 * Used as a callback for chunk field updates in the UI.
 * 
 * @param chunkId - The ID of the chunk to update
 * @param field - The field name to update
 * @param value - The new value for the field
 */
export type UpdateChunkFieldFn = (
    chunkId: number,
    field: keyof ChunkType,
    value: string
) => void;

