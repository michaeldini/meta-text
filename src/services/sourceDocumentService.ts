import { handleApiResponse, apiGet, apiPost, apiDelete } from '../utils/api';
import { withCache, apiCache } from '../utils/cache';
import type { SourceDocumentSummary, SourceDocumentDetail, SourceDocumentCreate } from 'types';

// Base functions without caching
async function _fetchSourceDocuments(): Promise<SourceDocumentSummary[]> {
    const data = await apiGet<SourceDocumentSummary[]>('/api/source-documents');
    return Array.isArray(data) ? data : [];
}

async function _fetchSourceDocument(docId: string): Promise<SourceDocumentDetail> {
    const parsedId = parseInt(docId, 10);
    if (isNaN(parsedId)) {
        throw new Error('Invalid document ID');
    }
    return await apiGet<SourceDocumentDetail>(`/api/source-documents/${encodeURIComponent(String(parsedId))}`);
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

export async function createSourceDocument(title: string, file: File): Promise<SourceDocumentCreate> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    const data = await apiPost<SourceDocumentCreate>('/api/source-documents', formData);

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        throw new Error('Upload failed: invalid response');
    }

    // Invalidate source documents list cache since we added a new document
    apiCache.invalidate('fetchSourceDocuments');

    return data;
}

export async function deleteSourceDocument(docId: number): Promise<{ success: boolean }> {
    const data = await apiDelete<{ success: boolean }>(`/api/source-documents/${encodeURIComponent(String(docId))}`);

    // Invalidate both list and individual document caches
    apiCache.invalidate('fetchSourceDocuments');
    apiCache.invalidate(`fetchSourceDocument:${docId}`);

    return data;
}
