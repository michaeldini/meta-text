// Service for meta-text API calls
import { handleApiResponse, apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import { withCache, apiCache } from '../utils/cache';
import type { MetaText } from '../types/metaText';
import log from '../utils/logger';

// Base functions without caching
async function _fetchMetaTexts(): Promise<MetaText[]> {
    const data = await apiGet<MetaText[]>('/api/meta-text');
    log.info('Fetched meta texts:', data?.length || 0);
    return Array.isArray(data) ? data : [];
}

async function _fetchMetaText(id: number): Promise<MetaText> {
    log.info('Fetching meta text with id:', id);
    return await apiGet<MetaText>(`/api/meta-text/${id}`);
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

export async function createMetaText(sourceDocId: number, title: string): Promise<MetaText> {
    const data = await apiPost<MetaText>('/api/meta-text', { sourceDocId, title });

    // Invalidate meta texts list cache since we added a new meta text
    apiCache.invalidate('fetchMetaTexts');

    return data;
}

export async function updateMetaText(id: number, content: Partial<MetaText>): Promise<MetaText> {
    const data = await apiPut<MetaText>(`/api/meta-text/${id}`, content);

    // Invalidate both list and specific meta text caches
    apiCache.invalidate('fetchMetaTexts');
    apiCache.invalidate(`fetchMetaText:${id}`);

    return data;
}

export async function deleteMetaText(id: number): Promise<{ success: boolean }> {
    const data = await apiDelete<{ success: boolean }>(`/api/meta-text/${id}`);

    // Invalidate both list and specific meta text caches
    apiCache.invalidate('fetchMetaTexts');
    apiCache.invalidate(`fetchMetaText:${id}`);

    return data;
}
