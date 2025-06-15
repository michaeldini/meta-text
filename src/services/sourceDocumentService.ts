import { handleApiResponse } from '../utils/api';
import type { SourceDocument } from '../types/sourceDocument';

export async function fetchSourceDocuments(): Promise<SourceDocument[]> {
    const res = await fetch('/api/source-documents');
    const data = await handleApiResponse(res, 'Failed to fetch source documents');
    return Array.isArray(data) ? data : [];
}

export async function fetchSourceDocument(docId: number): Promise<SourceDocument> {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(String(docId))}`);
    const data = await handleApiResponse(res, 'Failed to fetch document');
    return data;
}

export async function createSourceDocument(title: string, file: File): Promise<SourceDocument> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    const res = await fetch('/api/source-documents', {
        method: 'POST',
        body: formData,
    });
    return handleApiResponse(res, 'Upload failed.');
}

export async function deleteSourceDocument(docId: number): Promise<{ success: boolean }> {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(String(docId))}`, { method: 'DELETE' });
    const data = await handleApiResponse(res, 'Failed to delete source document');
    return data;
}
