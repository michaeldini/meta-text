// src/services/metaTextService.js

// Service for meta-text API calls
export async function fetchMetaTextList() {
    const res = await fetch('/api/meta-text');
    if (!res.ok) throw new Error('Failed to fetch meta-text list');
    return res.json();
}

export async function fetchMetaTextContent(title) {
    const res = await fetch(`/api/meta-text/${encodeURIComponent(title)}`);
    if (!res.ok) throw new Error('Not found');
    return res.json();
}

export async function saveMetaText(title, sections) {
    const res = await fetch('/api/meta-text/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, sections }),
    });
    if (!res.ok) throw new Error('Save failed');
    return res.json();
}

export async function fetchMetaTexts() {
    const res = await fetch('/api/meta-text');
    if (!res.ok) throw new Error('Failed to fetch meta texts');
    const data = await res.json();
    return data.meta_texts || [];
}

export async function createMetaText(sourceTitle, newTitle) {
    const res = await fetch('/api/meta-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceTitle, newTitle })
    });
    if (!res.ok) {
        let data;
        try { data = await res.json(); } catch { data = {}; }
        throw new Error(data.detail || 'Create failed.');
    }
    return true;
}

export async function fetchMetaText(title) {
    const res = await fetch(`/api/meta-text/${encodeURIComponent(title)}`);
    if (!res.ok) throw new Error('Failed to fetch meta text');
    return await res.json();
}

export async function deleteMetaText(title) {
    const res = await fetch(`/api/meta-text/${encodeURIComponent(title)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete meta-text');
    return true;
}
