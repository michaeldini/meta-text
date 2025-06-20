// src/services/metaTextService-improved.ts
// Improved service with consistent patterns, proper typing, and clean code

import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api-improved';
import type { MetaText } from '../types/metaText';
import log from '../utils/logger';

// API endpoints
const ENDPOINTS = {
    META_TEXTS: '/api/meta-text',
    META_TEXT: (id: number) => `/api/meta-text/${id}`,
} as const;

// Response types for better type safety
interface CreateMetaTextRequest {
    sourceDocId: number;
    title: string;
}

interface UpdateMetaTextRequest extends Partial<MetaText> { }

interface DeleteMetaTextResponse {
    success: boolean;
}

/**
 * Fetches all meta texts
 */
export async function fetchMetaTexts(): Promise<MetaText[]> {
    try {
        const data = await apiGet<MetaText[]>(ENDPOINTS.META_TEXTS);
        log.info(`Fetched ${data?.length || 0} meta texts`);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        log.error('Failed to fetch meta texts:', error);
        throw error;
    }
}

/**
 * Fetches a single meta text by ID
 */
export async function fetchMetaText(id: number): Promise<MetaText> {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid meta text ID');
    }

    try {
        const data = await apiGet<MetaText>(ENDPOINTS.META_TEXT(id));
        log.info(`Fetched meta text: ${id}`);
        return data;
    } catch (error) {
        log.error(`Failed to fetch meta text ${id}:`, error);
        throw error;
    }
}

/**
 * Creates a new meta text
 */
export async function createMetaText(
    sourceDocId: number,
    title: string
): Promise<MetaText> {
    if (!Number.isInteger(sourceDocId) || sourceDocId <= 0) {
        throw new Error('Invalid source document ID');
    }
    if (!title?.trim()) {
        throw new Error('Title is required');
    }

    const requestData: CreateMetaTextRequest = { sourceDocId, title: title.trim() };

    try {
        const data = await apiPost<MetaText>(ENDPOINTS.META_TEXTS, requestData);
        log.info(`Created meta text: ${data.id}`);
        return data;
    } catch (error) {
        log.error('Failed to create meta text:', error);
        throw error;
    }
}

/**
 * Updates an existing meta text
 */
export async function updateMetaText(
    id: number,
    updates: UpdateMetaTextRequest
): Promise<MetaText> {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid meta text ID');
    }
    if (!updates || Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
    }

    try {
        const data = await apiPut<MetaText>(ENDPOINTS.META_TEXT(id), updates);
        log.info(`Updated meta text: ${id}`);
        return data;
    } catch (error) {
        log.error(`Failed to update meta text ${id}:`, error);
        throw error;
    }
}

/**
 * Deletes a meta text
 */
export async function deleteMetaText(id: number): Promise<DeleteMetaTextResponse> {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid meta text ID');
    }

    try {
        const data = await apiDelete<DeleteMetaTextResponse>(ENDPOINTS.META_TEXT(id));
        log.info(`Deleted meta text: ${id}`);
        return data;
    } catch (error) {
        log.error(`Failed to delete meta text ${id}:`, error);
        throw error;
    }
}
