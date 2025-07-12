/**
 * Source Document Service
 * 
 * This service provides a caching layer for source document operations with the backend API.
 * It implements a two-tier architecture:
 * 
 * 1. Base functions (_fetchSourceDocuments, _fetchSourceDocument) that make direct API calls
 * 2. Cached wrapper functions that use the withCache utility for performance optimization
 * 
 * Caching Strategy:
 * - Source document lists are cached for 10 minutes (fetchSourceDocuments)
 * - Individual documents are cached for 15 minutes (fetchSourceDocument)
 * - Cache is automatically invalidated when documents are created or deleted
 * 
 * The service handles:
 * - Fetching paginated lists of source documents with summaries
 * - Retrieving detailed information for individual documents
 * - Creating new documents via file upload with FormData
 * - Deleting documents and cleaning up associated cache entries
 * 
 * All functions include proper error handling and type safety with TypeScript interfaces.
 */

import { apiGet, apiPost, apiDelete, apiPut } from '../utils/api';
import { withCache, apiCache } from '../utils/cache';
import type { SourceDocumentSummary, SourceDocumentDetail, SourceDocumentCreate, SourceDocumentUpdate } from 'types';

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

export async function updateSourceDocument(docId: number, updateData: SourceDocumentUpdate): Promise<SourceDocumentDetail> {
    const data = await apiPut<SourceDocumentDetail>(`/api/source-documents/${encodeURIComponent(String(docId))}`, updateData);

    // Invalidate both list and individual document caches since we updated a document
    apiCache.invalidate('fetchSourceDocuments');
    apiCache.invalidate(`fetchSourceDocument:${docId}`);

    return data;
}
