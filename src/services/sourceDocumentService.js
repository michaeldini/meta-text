// src/services/sourceDocumentService.js
import { handleApiResponse } from '../utils/api';


export async function fetchSourceDocuments() {
    const res = await fetch('/api/source-documents');
    const data = await handleApiResponse(res, 'Failed to fetch source documents');
    // Backend now returns a flat array of docs
    return Array.isArray(data) ? data : [];
}

export async function fetchSourceDocument(docId) {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(docId)}`);
    const data = await handleApiResponse(res, 'Failed to fetch document');
    return data;
}

export async function createSourceDocument(title, file) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    const res = await fetch('/api/source-documents', {
        method: 'POST',
        body: formData,
    });
    const data = await handleApiResponse(res, 'Upload failed.');
    // Backend returns { success, id, title }
    return { id: data.id, title: data.title };
}

export async function deleteSourceDocument(docId) {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(docId)}`, { method: 'DELETE' });
    const data = await handleApiResponse(res, 'Failed to delete source document');
    // Backend returns { success: true }
    return data;
}

export async function updateSourceDocument(docId, {
    title,
    text,
    summary,
    characters,
    locations,
    themes,
    symbols
}) {
    const payload = {};
    if (title !== undefined) payload.title = title;
    if (text !== undefined) payload.text = text;
    if (summary !== undefined) payload.summary = summary;
    if (characters !== undefined) payload.characters = characters;
    if (locations !== undefined) payload.locations = locations;
    if (themes !== undefined) payload.themes = themes;
    if (symbols !== undefined) payload.symbols = symbols;
    const res = await fetch(`/api/source-documents/${encodeURIComponent(docId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await handleApiResponse(res, 'Update failed.');
    // Backend returns { success, id }
    return data;
}


export async function fetchAiSummary(title) {
    const res = await fetch(`/api/ai-summary/${encodeURIComponent(title)}`);
    const data = await handleApiResponse(res, 'Failed to fetch AI summary');
    return data && data.result ? data.result : null;
}

export async function generateSourceDocInfo(title, text) {
    const res = await fetch("/api/source-doc-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, title }),
    });
    const data = await handleApiResponse(res, 'Summary failed');
    return data.result;
}


export async function fetchSourceDocumentsWithDetails() {
    const res = await fetch('/api/source-documents-with-details');
    const data = await handleApiResponse(res, 'Failed to fetch source documents with details');
    return data.source_documents || [];
}
