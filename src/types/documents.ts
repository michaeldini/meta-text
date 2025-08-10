/**
 * Document Types:
 * - SourceDocumentSummary
 * - SourceDocumentDetail
 * - SourceDocumentCreate
 * - SourceDocumentUpdate
 * - MetatextSummary
 * - MetatextDetail
 * - MetatextCreate
 * - ChunkType
 * - UpdateChunkFieldFn
 * - UseUpdateChunkFieldType
 * - UpdateChunkFieldMutationFn
 */
import type { UseMutationResult } from '@tanstack/react-query';
import { AiImage, Rewrite } from '@mtypes/tools'
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
    bookmarked_by_user_id?: number | null;
};


// React Query mutation type for useUpdateChunkField hook
export type UseUpdateChunkFieldType = UseMutationResult<
    ChunkType,
    unknown,
    { chunkId: number; field: string; value: any },
    unknown
>;

export type UpdateChunkFieldMutationFn = (
    variables: { chunkId: number; field: string; value: any }
) => void;


