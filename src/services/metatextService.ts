/**
 * Meta Text Service
 * 
 * This service provides an interface for managing meta text documents through API calls.
 * Meta texts are derived documents that provide summaries, analyses, or transformed versions
 * of source documents.
 * 
 * Key Features:
 * - Fetching meta text lists and individual documents
 * - Creating new meta texts from source documents
 * - Deleting existing meta texts
 * - Intelligent caching with different TTL strategies
 * - Automatic cache invalidation on mutations
 * 
 * Caching Strategy:
 * - Meta text lists are cached for 10 minutes (frequently changing)
 * - Individual meta texts are cached for 15 minutes (more stable)
 * - Cache is automatically invalidated when creating or deleting meta texts
 * 
 * API Operations:
 * - GET /api/metatext - Fetch all meta texts (returns MetatextSummary[])
 * - GET /api/metatext/:id - Fetch specific meta text (returns MetatextDetail)
 * - POST /api/metatext - Create new meta text (requires sourceDocId and title)
 * - DELETE /api/metatext/:id - Delete meta text (returns success status)
 */

import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import { withCache, apiCache } from '../utils/cache';
import type { MetatextSummary, MetatextDetail, MetatextCreate } from 'types';
import log from '../utils/logger';

// Base functions without caching
async function _fetchMetatexts(): Promise<MetatextSummary[]> {
    const data = await apiGet<MetatextSummary[]>('/api/metatext');
    log.info('Fetched meta texts:', data?.length || 0);
    return Array.isArray(data) ? data : [];
}

async function _fetchMetatext(id: number, userId: number): Promise<MetatextDetail> {
    log.info('Fetching meta text with id:', id, 'for user:', userId);
    return await apiGet<MetatextDetail>(`/api/metatext/${id}?user_id=${userId}`);
}

// Cached versions (10 minutes for lists, 15 minutes for individual documents)
export const fetchMetatexts = withCache(
    'fetchMetatexts',
    _fetchMetatexts,
    10 * 60 * 1000 // 10 minutes
);

export const fetchMetatext = withCache(
    'fetchMetatext',
    _fetchMetatext,
    15 * 60 * 1000 // 15 minutes
);

export async function createMetatext(sourceDocId: number, title: string): Promise<MetatextCreate> {
    const data = await apiPost<MetatextCreate>('/api/metatext', { sourceDocId, title });

    // Invalidate meta texts list cache since we added a new meta text
    apiCache.invalidate('fetchMetatexts');

    return data;
}

export async function deleteMetatext(id: number): Promise<{ success: boolean }> {
    const data = await apiDelete<{ success: boolean }>(`/api/metatext/${id}`);

    // Invalidate both list and specific meta text caches
    apiCache.invalidate('fetchMetatexts');
    apiCache.invalidate(`fetchMetatext:${id}`);

    return data;
}
