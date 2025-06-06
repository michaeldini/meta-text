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
    // Return the full document object from the backend
    return handleApiResponse(res, 'Upload failed.');
}

export async function deleteSourceDocument(docId) {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(docId)}`, { method: 'DELETE' });
    const data = await handleApiResponse(res, 'Failed to delete source document');
    // Backend returns { success: true }
    return data;
}


export async function fetchSourceDocumentInfo(docId) {
    const res = await fetch(`/api/source-documents/${docId}/info`);
    return handleApiResponse(res, 'Failed to fetch source document info');
}

export async function generateSourceDocInfo(id, text) {
    const res = await fetch("/api/source-doc-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, id }),
    });
    const data = await handleApiResponse(res, 'Summary failed');
    return data.result;
}
