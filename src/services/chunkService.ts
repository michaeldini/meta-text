import { handleApiResponse, apiGet, apiPost, apiPut } from '../utils/api';
import { withCache, apiCache } from '../utils/cache';
import type { Chunk } from '../types/chunk';

// Base functions without caching
async function _fetchChunks(metaTextId: number): Promise<Chunk[]> {
    const data = await apiGet<Chunk[]>(`/api/chunks/all/${metaTextId}`);
    return Array.isArray(data) ? data : [];
}

// Cached version (5 minutes for chunks list)
export const fetchChunks = withCache(
    'fetchChunks',
    _fetchChunks,
    5 * 60 * 1000 // 5 minutes
);

export async function splitChunk(chunkId: number, wordIndex: number): Promise<Chunk[]> {
    const data = await apiPost<Chunk[]>(`/api/chunk/${chunkId}/split?word_index=${wordIndex}`, null);

    // Invalidate caches since chunks were modified
    apiCache.invalidate(/fetchChunk/); // Invalidate all chunk-related cache entries

    return Array.isArray(data) ? data : [];
}

export async function combineChunks(firstChunkId: number, secondChunkId: number): Promise<Chunk | null> {
    const data = await apiPost<Chunk | null>(`/api/chunk/combine?first_chunk_id=${firstChunkId}&second_chunk_id=${secondChunkId}`, null);

    // Invalidate caches since chunks were modified
    apiCache.invalidate(/fetchChunk/); // Invalidate all chunk-related cache entries

    return data || null;
}

export async function updateChunk(chunkId: number, chunkData: Partial<Chunk>): Promise<Chunk> {
    const data = await apiPut<Chunk>(`/api/chunk/${chunkId}`, chunkData);
    if (!data || Object.keys(data).length === 0) {
        throw new Error('Failed to update chunk');
    }

    // Invalidate specific chunk and its parent chunks list
    apiCache.invalidate(`fetchChunk:${chunkId}`);
    apiCache.invalidate(/fetchChunks/); // Invalidate chunks lists

    return data;
}

// Base function for individual chunk fetching
async function _fetchChunk(chunkId: number): Promise<Chunk> {
    const data = await apiGet<Chunk>(`/api/chunk/${chunkId}`);
    if (!data || Object.keys(data).length === 0) {
        throw new Error('Failed to fetch chunk');
    }
    return data;
}

// Cached version (10 minutes for individual chunks)
export const fetchChunk = withCache(
    'fetchChunk',
    _fetchChunk,
    10 * 60 * 1000 // 10 minutes
);
