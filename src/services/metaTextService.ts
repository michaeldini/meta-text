// Service for meta-text API calls
import { handleApiResponse } from '../utils/api';
import { withCache, apiCache } from '../utils/cache';
import type { MetaText } from '../types/metaText';
import log from '../utils/logger';

// Base functions without caching
async function _fetchMetaTexts(): Promise<MetaText[]> {
    const res = await fetch('/api/meta-text');
    const data = await handleApiResponse<MetaText[]>(res, 'Failed to fetch meta texts');
    log.info('Fetched meta texts:', data?.length || 0);
    return Array.isArray(data) ? data : [];
}

async function _fetchMetaText(id: number): Promise<MetaText> {
    const res = await fetch(`/api/meta-text/${id}`);
    log.info('Fetching meta text with id:', id);
    return handleApiResponse<MetaText>(res, 'Failed to fetch meta text');
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
    const res = await fetch('/api/meta-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceDocId, title })
    });
    const data = await handleApiResponse<MetaText>(res, 'Create failed.');

    // Invalidate meta texts list cache since we added a new meta text
    apiCache.invalidate('fetchMetaTexts');

    return data;
}

export async function updateMetaText(id: number, content: Partial<MetaText>): Promise<MetaText> {
    const res = await fetch(`/api/meta-text/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
    const data = await handleApiResponse<MetaText>(res, 'Failed to update meta-text');

    // Invalidate both list and specific meta text caches
    apiCache.invalidate('fetchMetaTexts');
    apiCache.invalidate(`fetchMetaText:${id}`);

    return data;
}

export async function deleteMetaText(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`/api/meta-text/${id}`, { method: 'DELETE' });
    const data = await handleApiResponse<{ success: boolean }>(res, 'Failed to delete meta-text');

    // Invalidate both list and specific meta text caches
    apiCache.invalidate('fetchMetaTexts');
    apiCache.invalidate(`fetchMetaText:${id}`);

    return data;
}
