// src/services/sourceDocumentService.js

export async function fetchSourceDocuments() {
    const res = await fetch('/api/source-documents');
    if (!res.ok) throw new Error('Failed to fetch source documents');
    const data = await res.json();
    return data.source_documents || [];
}

export async function uploadSourceDocument(label, file) {
    const formData = new FormData();
    formData.append('label', label);
    formData.append('file', file);
    const res = await fetch('/api/source-documents', {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        let data;
        try { data = await res.json(); } catch { data = {}; }
        throw new Error(data.detail || 'Upload failed.');
    }
    return true;
}

export async function deleteSourceDocument(label) {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(label)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete source document');
    return true;
}
