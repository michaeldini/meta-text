import { api } from '../utils/ky';
import type { SourceDocumentSummary, SourceDocumentDetail, SourceDocumentCreate, SourceDocumentUpdate } from '@mtypes/documents';

// Fetch all source documents
export async function fetchSourceDocuments(): Promise<SourceDocumentSummary[]> {
    return api.get('source-documents').json<SourceDocumentSummary[]>();
}

// Fetch a single source document by ID
export async function fetchSourceDocument(docId: number): Promise<SourceDocumentDetail> {
    return api.get(`source-documents/${encodeURIComponent(String(docId))}`).json<SourceDocumentDetail>();
}

export async function createSourceDocument(title: string, file: File): Promise<SourceDocumentCreate> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    return api.post('source-documents', { body: formData }).json<SourceDocumentCreate>();
}

export async function deleteSourceDocument(docId: number): Promise<{ success: boolean }> {
    return api.delete(`source-documents/${encodeURIComponent(String(docId))}`).json<{ success: boolean }>();
}

export async function updateSourceDocument(docId: number, updateData: SourceDocumentUpdate): Promise<SourceDocumentDetail> {
    return api.put(`source-documents/${encodeURIComponent(String(docId))}`, {
        json: updateData
    }).json<SourceDocumentDetail>();
}