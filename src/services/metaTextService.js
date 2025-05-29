// src/services/metaTextService.js

export async function fetchMetaTexts() {
    const res = await fetch('/api/meta-text');
    if (!res.ok) throw new Error('Failed to fetch meta-texts');
    const data = await res.json();
    return data.meta_texts || [];
}

export async function createMetaText(sourceLabel, newLabel) {
    const res = await fetch('/api/meta-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceLabel, newLabel }),
    });
    if (!res.ok) {
        let data;
        try { data = await res.json(); } catch { data = {}; }
        throw new Error(data.detail || 'Failed to create meta-text.');
    }
    return true;
}

export async function deleteMetaText(label) {
    const res = await fetch(`/api/meta-text/${encodeURIComponent(label)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete meta-text');
    return true;
}
