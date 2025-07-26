
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from 'store';
import {
    fetchSourceDocuments,
    fetchMetatexts,
    deleteSourceDocument,
    deleteMetatext,
    createSourceDocument,
    createMetatext
} from 'services';
import type { SourceDocumentSummary, MetatextSummary } from 'types';



export function useSourceDocuments() {
    return useQuery<SourceDocumentSummary[]>({
        queryKey: ['source-documents'],
        queryFn: fetchSourceDocuments,
        staleTime: 10 * 60 * 1000, // 10 minutes, matches your cache
    });
}



export function useMetatexts() {
    return useQuery<MetatextSummary[]>({
        queryKey: ['metatexts'],
        queryFn: fetchMetatexts,
        staleTime: 10 * 60 * 1000, // 10 minutes, matches your cache
    });
}

// Mutation hook for deleting a source document
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

// Mutation hook for deleting a metatext
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

// Mutation hook for adding a source document
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

// Mutation hook for adding a metatext
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

