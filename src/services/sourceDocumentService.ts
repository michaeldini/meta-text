import { api } from '../utils/ky';
import { HTTPError } from 'ky';
import type { SourceDocumentSummary, SourceDocumentDetail, SourceDocumentCreate, SourceDocumentUpdate } from '@mtypes/documents';

// Fetch all source documents
export async function fetchSourceDocuments(): Promise<SourceDocumentSummary[]> {
    try {
        return await api.get('source-documents').json<SourceDocumentSummary[]>();
    } catch (err) {
        if (err instanceof HTTPError) {
            const status = err.response.status;
            if (status === 404) throw new Error('No source documents found.');
            if (status === 400) throw new Error('Invalid request.');
            if (status === 422) throw new Error('Invalid query parameters.');
            throw new Error('Failed to load source documents.');
        }
        throw err;
    }
}

// Fetch a single source document by ID
export async function fetchSourceDocument(docId: number): Promise<SourceDocumentDetail> {
    try {
        return await api.get(`source-documents/${encodeURIComponent(String(docId))}`).json<SourceDocumentDetail>();
    } catch (err) {
        if (err instanceof HTTPError) {
            const status = err.response.status;
            if (status === 404) throw new Error('Document not found.');
            if (status === 400) throw new Error('Invalid request.');
            if (status === 422) throw new Error('Invalid document id.');
            throw new Error('Failed to load document.');
        }
        throw err;
    }
}

export async function createSourceDocument(title: string, file: File): Promise<SourceDocumentCreate> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    try {
        return await api.post('source-documents', { body: formData }).json<SourceDocumentCreate>();
    } catch (err) {
        if (err instanceof HTTPError) {
            const status = err.response.status;
            if (status === 400) throw new Error('Invalid request.');
            throw new Error('Failed to create source document.');
        }
        throw err;
    }
}

export async function deleteSourceDocument(docId: number): Promise<{ success: boolean }> {
    try {
        return await api.delete(`source-documents/${encodeURIComponent(String(docId))}`).json<{ success: boolean }>();
    } catch (err) {
        if (err instanceof HTTPError) {
            const status = err.response.status;
            if (status === 404) throw new Error('Document not found.');
            throw new Error('Failed to delete document.');
        }
        throw err;
    }
}

export async function updateSourceDocument(docId: number, updateData: SourceDocumentUpdate): Promise<SourceDocumentDetail> {
    try {
        return await api.put(`source-documents/${encodeURIComponent(String(docId))}`, {
            json: updateData
        }).json<SourceDocumentDetail>();
    } catch (err) {
        if (err instanceof HTTPError) {
            const status = err.response.status;
            if (status === 404) throw new Error('Document not found.');
            if (status === 400) throw new Error('Invalid request.');
            if (status === 422) throw new Error('Invalid document id.');
            throw new Error('Failed to update document.');
        }
        throw err;
    }
}