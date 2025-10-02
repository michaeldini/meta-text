/**
 * Types related to tools (e.g., AI image generation, rewriting) and used in `ChunkType` (documents.ts)
 */

/**
 * An AI-generated image associated with a chunk
 */
export type AiImage = {
    id: number;
    prompt: string;
    path: string;
    chunk_id: number;
};

/**
 * An AI-generated rewrite associated with a chunk
 */
export interface Rewrite {
    id: number;
    title: string;
    rewrite_text: string;
    chunk_id: number;
}
