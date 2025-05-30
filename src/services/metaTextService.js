// Service for meta-text API calls
import { handleApiResponse } from '../utils/api';

export async function fetchMetaTexts() {
    const res = await fetch('/api/meta-text');
    const data = await handleApiResponse(res, 'Failed to fetch meta texts');
    return data.meta_texts || [];
}

export async function fetchMetaText(title) {
    const res = await fetch(`/api/meta-text/${encodeURIComponent(title)}`);
    return handleApiResponse(res, 'Failed to fetch meta text');
}

export async function createMetaText(sourceTitle, newTitle) {
    const res = await fetch('/api/meta-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceTitle, newTitle })
    });
    return handleApiResponse(res, 'Create failed.');
}

export async function updateMetaText(title, content) {
    const res = await fetch(`/api/meta-text/${encodeURIComponent(title)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
    return handleApiResponse(res, 'Failed to update meta-text');
}

export async function deleteMetaText(title) {
    const res = await fetch(`/api/meta-text/${encodeURIComponent(title)}`, { method: 'DELETE' });
    return handleApiResponse(res, 'Failed to delete meta-text');
}
