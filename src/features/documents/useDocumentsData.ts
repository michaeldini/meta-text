
// React Query hooks for all CRUD operations for source documents and metatexts
// This file centralizes all hooks for fetching, creating, updating, and deleting documents and metatexts
// For maintainability, hooks are grouped by entity type and operation
import React from 'react';
import { useSuspenseQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@store/notificationStore';
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
    const notifications = useNotifications();
    return useSuspenseQuery<SourceDocumentSummary[]>({
        queryKey: ['source-documents'],
        queryFn: async () => {
            try {
                return await fetchSourceDocuments();
            } catch (err) {
                if (err instanceof HTTPError) {
                    const status = err.response.status;
                    if (status === 404) {
                        notifications.showError('No source documents found.');
                    } else if (status === 400) {
                        notifications.showError('Invalid request.');
                    } else if (status === 422) {
                        notifications.showError('Invalid query parameters.');
                    } else {
                        notifications.showError('Failed to load source documents.');
                    }
                    throw err;
                }
                const msg = getErrorMessage(err, 'Failed to load source documents.');
                notifications.showError(msg);
                throw new Error(msg);
            }
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}


// Fetch a single source document (detail)
export function useSourceDocumentDetail(id?: number | null) {
    const { showError } = useNotifications();
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
                    if (status === 404) {
                        showError('Document not found.');
                    } else if (status === 400) {
                        showError('Invalid request.');
                    } else if (status === 422) {
                        showError('Invalid document id.');
                    } else {
                        // Handle unexpected HTTP errors
                        showError('Failed to load document.');
                    }
                    throw err;
                }
                // Handle unexpected errors
                const msg = getErrorMessage(err, 'Failed to load document.');
                showError(msg);
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
    const { showSuccess, showError } = useNotifications();
    return useMutation({
        mutationFn: async (updateData: SourceDocumentUpdate) => {
            if (docId == null) throw new Error('No document ID provided');
            return updateSourceDocument(docId, updateData);
        },
        onSuccess: (data) => {
            if (docId != null) {
                queryClient.setQueryData(['sourceDocumentDetail', docId], data);
                showSuccess('Document updated successfully');
            }
        },
        onError: (error) => {
            const msg = getErrorMessage(error, 'Failed to update document.');
            showError(msg);
        },
    });
}

// Metatext Queries & Mutations

export function useMetatexts() {
    const notifications = useNotifications();
    return useSuspenseQuery<MetatextSummary[]>({
        queryKey: ['metatexts'],
        queryFn: async () => {
            try {
                return await fetchMetatexts();
            } catch (err) {
                if (err instanceof HTTPError) {
                    const status = err.response.status;
                    if (status === 404) {
                        notifications.showError('No metatexts found.');
                    } else if (status === 400) {
                        notifications.showError('Invalid request.');
                    } else if (status === 422) {
                        notifications.showError('Invalid query parameters.');
                    } else {
                        notifications.showError('Failed to load metatexts.');
                    }
                    throw err;
                }
                const msg = getErrorMessage(err, 'Failed to load metatexts.');
                notifications.showError(msg);
                throw new Error(msg);
            }
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}


// Fetch a single metatext (detail)
export function useMetatextDetail(id: number | null) {
    const { showError } = useNotifications();
    return useQuery<MetatextDetail>({
        queryKey: ['metatextDetail', id],
        queryFn: async () => {
            if (id == null) throw new Error('No metatext ID provided');
            try {
                return await fetchMetatext(id);
            } catch (err) {
                if (err instanceof HTTPError) {
                    const status = err.response.status;
                    if (status === 404) {
                        showError('Metatext not found.');
                    } else if (status === 400) {
                        showError('Invalid request.');
                    } else if (status === 422) {
                        showError('Invalid metatext id.');
                    } else {
                        showError('Failed to load metatext.');
                    }
                    throw err;
                }
                const msg = getErrorMessage(err, 'Failed to load metatext.');
                showError(msg);
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
    const { showSuccess, showError } = useNotifications();
    return useMutation({
        mutationFn: deleteSourceDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['source-documents'] });
            showSuccess('Deleted successfully');
        },
        onError: () => {
            showError('Delete failed');
        },
    });
}


// Delete a metatext
export function useDeleteMetatext() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotifications();
    return useMutation({
        mutationFn: deleteMetatext,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['metatexts'] });
            showSuccess('Deleted successfully');
        },
        onError: () => {
            showError('Delete failed');
        },
    });
}


// Add a source document
// Accepts: { title: string, file: File }
export function useAddSourceDocument() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotifications();
    return useMutation({
        mutationFn: async ({ title, file }: { title: string; file: File }) => {
            return createSourceDocument(title, file);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['source-documents'] });
            showSuccess(`Successfully uploaded "${variables.title}"`);
        },
        onError: () => {
            showError('Failed to upload document');
        },
    });
}


// Add a metatext
// Accepts: { sourceDocId: number, title: string }
export function useAddMetatext() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotifications();
    return useMutation({
        mutationFn: async ({ sourceDocId, title }: { sourceDocId: number; title: string }) => {
            return createMetatext(sourceDocId, title);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['metatexts'] });
            showSuccess(`Successfully created metatext "${variables.title}"`);
        },
        onError: () => {
            showError('Failed to create metatext');
        },
    });
}

