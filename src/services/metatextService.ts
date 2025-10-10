// Meta Text Service
// Provides API calls for managing meta text documents (summaries, analyses, etc.)
// Follows the ky pattern for API requests, see sourceDocumentService.ts for reference

import { api } from '@utils/ky';
import { HTTPError } from 'ky';
import type { MetatextSummary, MetatextDetail, MetatextCreate } from '@mtypes/documents';

// Fetch all meta texts
export async function fetchMetatexts(): Promise<MetatextSummary[]> {
    try {
        return await api.get('metatext').json<MetatextSummary[]>();
    } catch (err) {
        if (err instanceof HTTPError) {
            const status = err.response.status;
            if (status === 404) throw new Error('No metatexts found.');
            if (status === 400) throw new Error('Invalid request.');
            if (status === 422) throw new Error('Invalid query parameters.');
            throw new Error('Failed to load metatexts.');
        }
        throw err;
    }
}

// Fetch a single meta text by ID
export async function fetchMetatext(id: number): Promise<MetatextDetail> {
    try {
        return await api.get(`metatext/${encodeURIComponent(String(id))}`).json<MetatextDetail>();
    } catch (err) {
        if (err instanceof HTTPError) {
            const status = err.response.status;
            if (status === 404) throw new Error('Metatext not found.');
            if (status === 400) throw new Error('Invalid request.');
            if (status === 422) throw new Error('Invalid metatext id.');
            throw new Error('Failed to load metatext.');
        }
        throw err;
    }
}

// Create a new meta text
export async function createMetatext(sourceDocId: number, title: string): Promise<MetatextCreate> {
    try {
        return await api.post('metatext', {
            json: { sourceDocId, title }
        }).json<MetatextCreate>();
    } catch (err) {
        if (err instanceof HTTPError) {
            const status = err.response.status;
            if (status === 400) throw new Error('Invalid request.');
            if (status === 404) throw new Error('Source document not found.');
            throw new Error('Failed to create metatext.');
        }
        throw err;
    }
}

// Delete a meta text by ID
export async function deleteMetatext(id: number): Promise<{ success: boolean }> {
    try {
        return await api.delete(`metatext/${encodeURIComponent(String(id))}`).json<{ success: boolean }>();
    } catch (err) {
        if (err instanceof HTTPError) {
            const status = err.response.status;
            if (status === 404) throw new Error('Metatext not found.');
            throw new Error('Failed to delete metatext.');
        }
        throw err;
    }
}

// Download a metatext as raw JSON payload
// Returns whatever the backend provides for the download endpoint
export async function downloadMetatext(id: number): Promise<unknown> {
    try {
        return await api
            .get(`metatext/${encodeURIComponent(String(id))}/download`)
            .json<unknown>();
    } catch (err) {
        if (err instanceof HTTPError) {
            const status = err.response.status;
            if (status === 404) throw new Error('Metatext not found.');
            throw new Error('Failed to download metatext.');
        }
        throw err;
    }
}
