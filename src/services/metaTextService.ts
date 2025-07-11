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
 * - GET /api/meta-text - Fetch all meta texts (returns MetaTextSummary[])
 * - GET /api/meta-text/:id - Fetch specific meta text (returns MetaTextDetail)
 * - POST /api/meta-text - Create new meta text (requires sourceDocId and title)
 * - DELETE /api/meta-text/:id - Delete meta text (returns success status)
 */

import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import { withCache, apiCache } from '../utils/cache';
import type { MetaTextSummary, MetaTextDetail, MetaTextCreate } from 'types';
import log from '../utils/logger';

// Base functions without caching
async function _fetchMetaTexts(): Promise<MetaTextSummary[]> {
    const data = await apiGet<MetaTextSummary[]>('/api/meta-text');
    log.info('Fetched meta texts:', data?.length || 0);
    return Array.isArray(data) ? data : [];
}

async function _fetchMetaText(id: number): Promise<MetaTextDetail> {
    log.info('Fetching meta text with id:', id);
    return await apiGet<MetaTextDetail>(`/api/meta-text/${id}`);
}

// Cached versions (10 minutes for lists, 15 minutes for individual documents)
export const fetchMetaTexts = withCache(
    'fetchMetaTexts',
    _fetchMetaTexts,
    10 * 60 * 1000 // 10 minutes
);

export const fetchMetaText = withCache(
    'fetchMetaText',
    _fetchMetaText,
    15 * 60 * 1000 // 15 minutes
);

export async function createMetaText(sourceDocId: number, title: string): Promise<MetaTextCreate> {
    const data = await apiPost<MetaTextCreate>('/api/meta-text', { sourceDocId, title });

    // Invalidate meta texts list cache since we added a new meta text
    apiCache.invalidate('fetchMetaTexts');

    return data;
}

export async function deleteMetaText(id: number): Promise<{ success: boolean }> {
    const data = await apiDelete<{ success: boolean }>(`/api/meta-text/${id}`);

    // Invalidate both list and specific meta text caches
    apiCache.invalidate('fetchMetaTexts');
    apiCache.invalidate(`fetchMetaText:${id}`);

    return data;
}
