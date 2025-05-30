// src/services/sourceDocumentService.js
import { handleApiResponse } from '../utils/api';


export async function fetchSourceDocuments(full = false) {
    const url = full ? '/api/source-documents?full=true' : '/api/source-documents';
    const res = await fetch(url);
    const data = await handleApiResponse(res, 'Failed to fetch source documents');
    if (full) {
        return data.source_documents || [];
    }
    // Map array of strings to array of { title } objects if needed
    if (Array.isArray(data.source_documents) && typeof data.source_documents[0] === 'string') {
        return data.source_documents.map(title => ({ title }));
    }
    return data.source_documents || [];
}

export async function fetchSourceDocument(title) {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(title)}`);
    return handleApiResponse(res, 'Failed to fetch document');
}

export async function uploadSourceDocument(title, file) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    const res = await fetch('/api/source-documents', {
        method: 'POST',
        body: formData,
    });
    return handleApiResponse(res, 'Upload failed.');
}

export async function deleteSourceDocument(title) {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(title)}`, { method: 'DELETE' });
    return handleApiResponse(res, 'Failed to delete source document');
}

export async function updateSourceDocument(title, file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`/api/source-documents/${encodeURIComponent(title)}`, {
        method: 'PUT',
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
