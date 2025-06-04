// Service for meta-text API calls
import { handleApiResponse } from '../utils/api';

export async function fetchMetaTexts() {
    const res = await fetch('/api/meta-text');
    const data = await handleApiResponse(res, 'Failed to fetch meta texts');
    console.log('fetchMetaTexts response:', data);
    return data.data || [];
}

export async function fetchMetaText(id) {
    const res = await fetch(`/api/meta-text/${id}`);
    console.log('fetchMetaText response:', res);
    return handleApiResponse(res, 'Failed to fetch meta text');
}

export async function createMetaText(sourceDocId, title) {
    const res = await fetch('/api/meta-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceDocId, title })
    });
    return handleApiResponse(res, 'Create failed.');
}

export async function updateMetaText(id, content) {
    const res = await fetch(`/api/meta-text/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
    return handleApiResponse(res, 'Failed to update meta-text');
}

export async function deleteMetaText(id) {
    const res = await fetch(`/api/meta-text/${id}`, { method: 'DELETE' });
    return handleApiResponse(res, 'Failed to delete meta-text');
}
