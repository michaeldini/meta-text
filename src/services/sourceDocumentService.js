// src/services/sourceDocumentService.js
import { handleApiResponse } from '../utils/api';


export async function fetchSourceDocuments(full = false) {
    const url = full ? '/api/source-documents?full=true' : '/api/source-documents';
    const res = await fetch(url);
    const data = await handleApiResponse(res, 'Failed to fetch source documents');
    return data.source_documents || [];
}

export async function fetchSourceDocument(docId) {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(docId)}`);
    return handleApiResponse(res, 'Failed to fetch document');
}

export async function uploadSourceDocument(title, file, details = null) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    if (details !== null) formData.append('details', details);
    const res = await fetch('/api/source-documents', {
        method: 'POST',
        body: formData,
    });
    return handleApiResponse(res, 'Upload failed.');
}

export async function deleteSourceDocument(docId) {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(docId)}`, { method: 'DELETE' });
    return handleApiResponse(res, 'Failed to delete source document');
}

export async function updateSourceDocument(docId, { title, text, details }) {
    const formData = new FormData();
    if (title !== undefined) formData.append('title', title);
    if (text !== undefined) formData.append('text', text);
    if (details !== undefined) formData.append('details', details);
    const res = await fetch(`/api/source-documents/${encodeURIComponent(docId)}`, {
        method: 'PATCH',
        body: formData,
    });
    return handleApiResponse(res, 'Update failed.');
}


export async function fetchAiSummary(title) {
    const res = await fetch(`/api/ai-summary/${encodeURIComponent(title)}`);
    const data = await handleApiResponse(res, 'Failed to fetch AI summary');
    return data && data.result ? data.result : null;
}

export async function generateAiSummary(title, text) {
    const res = await fetch("/api/ai-complete-summary", {
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
