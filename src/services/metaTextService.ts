// Service for meta-text API calls
import { handleApiResponse } from '../utils/api';
import type { MetaText } from '../types/metaText';

export async function fetchMetaTexts(): Promise<MetaText[]> {
    const res = await fetch('/api/meta-text');
    const data = await handleApiResponse(res, 'Failed to fetch meta texts');
    console.log('fetchMetaTexts response:', data);
    return data || [];
}

export async function fetchMetaText(id: number): Promise<MetaText> {
    const res = await fetch(`/api/meta-text/${id}`);
    console.log('fetchMetaText response:', res);
    return handleApiResponse(res, 'Failed to fetch meta text');
}

export async function createMetaText(sourceDocId: number, title: string): Promise<MetaText> {
    const res = await fetch('/api/meta-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceDocId, title })
    });
    return handleApiResponse(res, 'Create failed.');
}

export async function updateMetaText(id: number, content: Partial<MetaText>): Promise<MetaText> {
    const res = await fetch(`/api/meta-text/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
    return handleApiResponse(res, 'Failed to update meta-text');
}

export async function deleteMetaText(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`/api/meta-text/${id}`, { method: 'DELETE' });
    return handleApiResponse(res, 'Failed to delete meta-text');
}
