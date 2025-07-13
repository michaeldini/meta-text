/**
 * Chunk Service - Manages document chunk operations with intelligent caching
 * 
 * This service provides a comprehensive API for managing document chunks and their compressions.
 * It implements a two-tier caching strategy to optimize performance:
 * 
 * CACHING STRATEGY:
 * - Individual chunks: Cached for 10 minutes (frequently accessed, less likely to change)
 * - Chunk lists: Cached for 5 minutes (more dynamic, needs fresher data)
 * - Cache invalidation: Automatically clears related caches when chunks are modified
 * 
 * CORE OPERATIONS:
 * - Fetch chunks (with caching): Retrieves all chunks for a metatext document
 * - Fetch individual chunk (with caching): Gets a specific chunk by ID
 * - Split chunks: Divides a chunk at a specified word index
 * - Combine chunks: Merges two adjacent chunks into one
 * - Update chunks: Modifies chunk properties with cache invalidation
 * 
 * COMPRESSION FEATURES:
 * - Create/read/update/delete chunk compressions
 * - Preview compression styles before saving
 * - Multiple compression styles per chunk support
 * 
 * The service uses a base function + cached wrapper pattern where base functions
 * (prefixed with _) perform the actual API calls, and exported functions add caching.
 * Cache invalidation patterns ensure data consistency when chunks are modified.
 */

import { apiGet, apiPost, apiPut } from '../utils/api';
import { withCache, apiCache } from '../utils/cache';
import type { ChunkCompression, ChunkCompressionCreate, ChunkType } from 'types';

// Base functions without caching
async function _fetchChunks(metatextId: number): Promise<ChunkType[]> {
    // TODO: Refactor to use meta_text service instead of chunk service
    // This should eventually be moved to metatextService.ts and get chunks from MetatextDetail
    const metatext = await apiGet<{ chunks?: ChunkType[] }>(`/api/metatext/${metatextId}`);
    return Array.isArray(metatext.chunks) ? metatext.chunks : [];
}

// Cached version (5 minutes for chunks list)
export const fetchChunks = withCache(
    'fetchChunks',
    _fetchChunks,
    5 * 60 * 1000 // 5 minutes
);

export async function splitChunk(chunkId: number, wordIndex: number): Promise<ChunkType[]> {
    const data = await apiPost<ChunkType[]>(`/api/chunk/${chunkId}/split?word_index=${wordIndex}`, null);

    // Invalidate caches since chunks were modified
    apiCache.invalidate(/fetchChunk/); // Invalidate all chunk-related cache entries

    return Array.isArray(data) ? data : [];
}

export async function combineChunks(firstChunkId: number, secondChunkId: number): Promise<ChunkType | null> {
    const data = await apiPost<ChunkType | null>(`/api/chunk/combine?first_chunk_id=${firstChunkId}&second_chunk_id=${secondChunkId}`, null);

    // Invalidate caches since chunks were modified
    apiCache.invalidate(/fetchChunk/); // Invalidate all chunk-related cache entries

    return data || null;
}

export async function updateChunk(chunkId: number, chunkData: Partial<ChunkType>): Promise<ChunkType> {
    const data = await apiPut<ChunkType>(`/api/chunk/${chunkId}`, chunkData);
    if (!data || Object.keys(data).length === 0) {
        throw new Error('Failed to update chunk');
    }

    // Invalidate specific chunk and its parent chunks list
    apiCache.invalidate(`fetchChunk:${chunkId}`);
    apiCache.invalidate(/fetchChunks/); // Invalidate chunks lists

    return data;
}

// Base function for individual chunk fetching
async function _fetchChunk(chunkId: number): Promise<ChunkType> {
    const data = await apiGet<ChunkType>(`/api/chunk/${chunkId}`);
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

// --- Chunk Compression API ---

export async function fetchChunkCompressions(chunkId: number): Promise<ChunkCompression[]> {
    return apiGet<ChunkCompression[]>(`/api/chunk/${chunkId}/compressions`);
}

export async function createChunkCompression(chunkId: number, data: ChunkCompressionCreate): Promise<ChunkCompression> {
    const result = await apiPost<ChunkCompression>(`/api/chunk/${chunkId}/compressions`, data);

    // Invalidate the specific chunk cache since it now has new compression data
    apiCache.invalidate(`fetchChunk:${chunkId}`);

    return result;
}

export async function updateChunkCompression(compressionId: number, data: ChunkCompressionCreate): Promise<ChunkCompression> {
    const result = await apiPut<ChunkCompression>(`/api/chunk-compression/${compressionId}`, data);

    // Since we don't have the chunkId directly, we'll invalidate all fetchChunk caches
    // Alternatively, the API could return the chunk_id in the response
    apiCache.invalidate(/fetchChunk:/);

    return result;
}

export async function deleteChunkCompression(compressionId: number): Promise<void> {
    await apiPost<void>(`/api/chunk-compression/${compressionId}`, null, { method: 'DELETE' });

    // Since we don't have the chunkId directly, we'll invalidate all fetchChunk caches
    apiCache.invalidate(/fetchChunk:/);
}

export async function previewChunkCompression(chunkId: number, styleTitle: string): Promise<{ title: string; compressed_text: string }> {
    return apiGet<{ title: string; compressed_text: string }>(`/api/generate-chunk-compression/${chunkId}?style_title=${encodeURIComponent(styleTitle)}`);
}
