
// Chunk Service
// Provides API calls for managing text chunks and rewrites
// Follows the ky pattern for API requests, see sourceDocumentService.ts for reference

import { api } from '@utils/ky';
import type { Rewrite, ChunkType } from '@mtypes/documents';


// Fetch all chunks for a metatext and user
export async function fetchChunks(metatextId: number): Promise<ChunkType[]> {
    const metatext = await api.get(`metatext/${metatextId}`).json<{ chunks?: ChunkType[] }>();
    return Array.isArray(metatext.chunks) ? metatext.chunks : [];
}


// Split a chunk at a given word index
export async function splitChunk(chunkId: number, wordIndex: number): Promise<ChunkType[]> {
    return api.post(`chunk/${chunkId}/split?word_index=${wordIndex}`).json<ChunkType[]>();
}



// Combine two chunks into one
export async function combineChunks(chunk: ChunkType): Promise<ChunkType | null> {
    return api.post(`chunk/combine?first_chunk_id=${chunk.id}`).json<ChunkType | null>();
}

// Update a chunk with new data
export async function updateChunk(chunkId: number, chunkData: Partial<ChunkType>): Promise<ChunkType> {
    const data = await api.put(`chunk/${chunkId}`, {
        json: chunkData
    }).json<ChunkType>();
    if (!data || Object.keys(data).length === 0) {
        throw new Error('Failed to update chunk');
    }
    return data;
}


// Fetch a single chunk by ID
export async function fetchChunk(chunkId: number): Promise<ChunkType> {
    const data = await api.get(`chunk/${chunkId}`).json<ChunkType>();
    if (!data || Object.keys(data).length === 0) {
        throw new Error('Failed to fetch chunk');
    }
    return data;
}



// Generate and save a chunk rewrite in one step (no preview)
export async function generateRewrite(chunkId: number, styleTitle: string): Promise<Rewrite> {
    return api.get(`generate-rewrite/${chunkId}?style_title=${encodeURIComponent(styleTitle)}`).json<Rewrite>();
}
