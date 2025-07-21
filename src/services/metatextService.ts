// Meta Text Service
// Provides API calls for managing meta text documents (summaries, analyses, etc.)
// Follows the ky pattern for API requests, see sourceDocumentService.ts for reference

import { api } from '../utils/ky';
import type { MetatextSummary, MetatextDetail, MetatextCreate } from 'types';

// Fetch all meta texts
export async function fetchMetatexts(): Promise<MetatextSummary[]> {
    return api.get('metatext').json<MetatextSummary[]>();
}

// Fetch a single meta text by ID
export async function fetchMetatext(id: number): Promise<MetatextDetail> {
    return api.get(`metatext/${encodeURIComponent(String(id))}`).json<MetatextDetail>();
}

// Create a new meta text
export async function createMetatext(sourceDocId: number, title: string): Promise<MetatextCreate> {
    return api.post('metatext', {
        json: { sourceDocId, title }
    }).json<MetatextCreate>();
}

// Delete a meta text by ID
export async function deleteMetatext(id: number): Promise<{ success: boolean }> {
    return api.delete(`metatext/${encodeURIComponent(String(id))}`).json<{ success: boolean }>();
}
