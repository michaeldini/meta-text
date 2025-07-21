// Custom hook for fetching the list of source documents using TanStack Query
// This replaces manual loading/error state and store logic for document lists


// Custom hooks for fetching and mutating source documents and metatexts using TanStack Query
// Handles all server data logic for documents/metatexts (fetch, add, delete)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    return useMutation({
        mutationFn: deleteSourceDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['source-documents'] });
        },
    });
}

// Mutation hook for deleting a metatext
export function useDeleteMetatext() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMetatext,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['metatexts'] });
        },
    });
}

// Mutation hook for adding a source document
// Accepts: { title: string, file: File }
export function useAddSourceDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ title, file }: { title: string; file: File }) => {
            return createSourceDocument(title, file);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['source-documents'] });
        },
    });
}

// Mutation hook for adding a metatext
// Accepts: { sourceDocId: number, title: string }
export function useAddMetatext() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ sourceDocId, title }: { sourceDocId: number; title: string }) => {
            return createMetatext(sourceDocId, title);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['metatexts'] });
        },
    });
}

