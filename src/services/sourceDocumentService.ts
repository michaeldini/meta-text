import { handleApiResponse } from '../utils/api';
import { withCache, apiCache } from '../utils/cache';
import type { SourceDocument } from '../types/sourceDocument';

// Base functions without caching
async function _fetchSourceDocuments(): Promise<SourceDocument[]> {
    const res = await fetch('/api/source-documents');
    const data = await handleApiResponse<SourceDocument[]>(res, 'Failed to fetch source documents');
    return Array.isArray(data) ? data : [];
}

async function _fetchSourceDocument(docId: string): Promise<SourceDocument> {
    const parsedId = parseInt(docId, 10);
    if (isNaN(parsedId)) {
        throw new Error('Invalid document ID');
    }
    const res = await fetch(`/api/source-documents/${encodeURIComponent(String(parsedId))}`);
    const data = await handleApiResponse<SourceDocument>(res, 'Failed to fetch document');
    return data;
}

// Cached versions (10 minutes for lists, 15 minutes for individual documents)
export const fetchSourceDocuments = withCache(
    'fetchSourceDocuments',
    _fetchSourceDocuments,
    10 * 60 * 1000 // 10 minutes
);

export const fetchSourceDocument = withCache(
    'fetchSourceDocument',
    _fetchSourceDocument,
    15 * 60 * 1000 // 15 minutes
);

export async function createSourceDocument(title: string, file: File): Promise<SourceDocument> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    const res = await fetch('/api/source-documents', {
        method: 'POST',
        body: formData,
    });
    const data = await handleApiResponse<SourceDocument>(res, 'Upload failed.');
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        throw new Error('Upload failed: invalid response');
    }
    
    // Invalidate source documents list cache since we added a new document
    apiCache.invalidate('fetchSourceDocuments');
    
    return data;
}

export async function deleteSourceDocument(docId: number): Promise<{ success: boolean }> {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(String(docId))}`, { method: 'DELETE' });
    const data = await handleApiResponse<{ success: boolean }>(res, 'Failed to delete source document');
    
    // Invalidate both list and individual document caches
    apiCache.invalidate('fetchSourceDocuments');
    apiCache.invalidate(`fetchSourceDocument:${docId}`);
    
    return data;
}
