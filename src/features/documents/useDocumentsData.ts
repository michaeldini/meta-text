
// React Query hooks for all CRUD operations for source documents and metatexts
// This file centralizes all hooks for fetching, creating, updating, and deleting documents and metatexts
// For maintainability, hooks are grouped by entity type and operation
import React from 'react';
import { useSuspenseQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchSourceDocuments,
    fetchSourceDocument,
    updateSourceDocument,
    deleteSourceDocument,
    createSourceDocument,
} from '@services/sourceDocumentService';
import {

    fetchMetatexts,
    fetchMetatext,
    deleteMetatext,
    createMetatext
} from '@services/metatextService';
import type {
    SourceDocumentSummary,
    SourceDocumentDetail,
    SourceDocumentUpdate,
    MetatextSummary,
    MetatextDetail
} from '@mtypes/documents';
import { getErrorMessage } from '@utils/error';
import { HTTPError } from 'ky';




// Source Document Queries & Mutations

export function useSourceDocuments() {
    return useSuspenseQuery<SourceDocumentSummary[]>({
        queryKey: ['source-documents'],
        queryFn: async () => {
            try {
                return await fetchSourceDocuments();
            } catch (err) {
                if (err instanceof HTTPError) {
                    const status = err.response.status;
                    // Differentiate common API errors for upstream UI handling
                    if (status === 404) throw new Error('No source documents found.');
                    if (status === 400) throw new Error('Invalid request.');
                    if (status === 422) throw new Error('Invalid query parameters.');
                    throw new Error('Failed to load source documents.');
                    throw err;
                }
                const msg = getErrorMessage(err, 'Failed to load source documents.');
                throw new Error(msg);
            }
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}


// Fetch a single source document (detail)
export function useSourceDocumentDetail(id?: number | null) {
    const queryClient = useQueryClient();
    const query = useQuery<SourceDocumentDetail>({
        queryKey: ['sourceDocumentDetail', id],
        queryFn: async () => {
            if (id == null) throw new Error('No document ID provided');
            try {
                return await fetchSourceDocument(id);
            } catch (err) {
                if (err instanceof HTTPError) {
                    const status = err.response.status;
                    if (status === 404) throw new Error('Document not found.');
                    if (status === 400) throw new Error('Invalid request.');
                    if (status === 422) throw new Error('Invalid document id.');
                    throw new Error('Failed to load document.');
                }
                const msg = getErrorMessage(err, 'Failed to load document.');
                throw new Error(msg);
            }
        },
        enabled: id != null,
        retry: 1,
        staleTime: 1000 * 60, // 1 minute
    });

    // Invalidate function for this query
    const invalidate = React.useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['sourceDocumentDetail', id] });
    }, [queryClient, id]);

    return {
        ...query,
        invalidate,
    };
}

// Update a source document
export function useUpdateSourceDocument(docId: number | null) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updateData: SourceDocumentUpdate) => {
            if (docId == null) throw new Error('No document ID provided');
            return updateSourceDocument(docId, updateData);
        },
        onSuccess: (data) => {
            if (docId != null) {
                queryClient.setQueryData(['sourceDocumentDetail', docId], data);
            }
        },
        onError: (error) => {
            const msg = getErrorMessage(error, 'Failed to update document.');
            // Surface the error for the UI to render an alert
            console.error(msg);
        },
    });
}

// Metatext Queries & Mutations

export function useMetatexts() {
    return useSuspenseQuery<MetatextSummary[]>({
        queryKey: ['metatexts'],
        queryFn: async () => {
            try {
                return await fetchMetatexts();
            } catch (err) {
                if (err instanceof HTTPError) {
                    const status = err.response.status;
                    if (status === 404) throw new Error('No metatexts found.');
                    if (status === 400) throw new Error('Invalid request.');
                    if (status === 422) throw new Error('Invalid query parameters.');
                    throw new Error('Failed to load metatexts.');
                }
                const msg = getErrorMessage(err, 'Failed to load metatexts.');
                throw new Error(msg);
            }
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}


// Fetch a single metatext (detail)
export function useMetatextDetail(id: number | null) {
    return useQuery<MetatextDetail>({
        queryKey: ['metatextDetail', id],
        queryFn: async () => {
            if (id == null) throw new Error('No metatext ID provided');
            try {
                return await fetchMetatext(id);
            } catch (err) {
                if (err instanceof HTTPError) {
                    const status = err.response.status;
                    if (status === 404) throw new Error('Metatext not found.');
                    if (status === 400) throw new Error('Invalid request.');
                    if (status === 422) throw new Error('Invalid metatext id.');
                    throw new Error('Failed to load metatext.');
                }
                const msg = getErrorMessage(err, 'Failed to load metatext.');
                throw new Error(msg);
            }
        },
        enabled: id != null,
        retry: 1,
        staleTime: 1000 * 60, // 1 minute
    });
}


// Delete a source document
export function useDeleteSourceDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSourceDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['source-documents'] });
        },
        onError: () => {
            // Re-throw or log for UI layer
            console.error('Delete failed');
        },
    });
}


// Delete a metatext
export function useDeleteMetatext() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMetatext,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['metatexts'] });
        },
        onError: () => {
            console.error('Delete failed');
        },
    });
}


// Add a source document
// Accepts: { title: string, file: File }
export function useAddSourceDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ title, file }: { title: string; file: File }) => {
            return createSourceDocument(title, file);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['source-documents'] });
        },
        onError: () => {
            console.error('Failed to upload document');
        },
    });
}


// Add a metatext
// Accepts: { sourceDocId: number, title: string }
export function useAddMetatext() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ sourceDocId, title }: { sourceDocId: number; title: string }) => {
            return createMetatext(sourceDocId, title);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['metatexts'] });
        },
        onError: () => {
            console.error('Failed to create metatext');
        },
    });
}

