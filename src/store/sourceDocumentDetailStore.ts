import { create } from 'zustand';
import { useEffect } from 'react';
import { fetchSourceDocument } from '../services/sourceDocumentService';
import { getErrorMessage } from '../types/error';
import type { SourceDocument } from '../types/sourceDocument';

interface SourceDocumentDetailState {
    // Current document being viewed
    currentDocId: string | null;
    doc: SourceDocument | null;
    loading: boolean;
    error: string;

    // Actions
    fetchSourceDocumentDetail: (id: string) => Promise<void>;
    updateDoc: (doc: SourceDocument) => void;
    refetch: () => Promise<void>;
    clearState: () => void;
    clearError: () => void;
}

export const useSourceDocumentDetailStore = create<SourceDocumentDetailState>((set, get) => ({
    // Initial state
    currentDocId: null,
    doc: null,
    loading: false,
    error: '',

    fetchSourceDocumentDetail: async (id: string) => {
        // Don't refetch if we're already viewing this document
        const { currentDocId } = get();
        if (currentDocId === id) return;

        set({
            loading: true,
            error: '',
            currentDocId: id,
            doc: null
        });

        try {
            const doc = await fetchSourceDocument(id);
            set({
                doc,
                loading: false,
                error: ''
            });
        } catch (error: unknown) {
            set({
                loading: false,
                error: getErrorMessage(error, 'Failed to load document.'),
                doc: null
            });
        }
    },

    updateDoc: (doc: SourceDocument) => {
        set({ doc });
    },

    refetch: async () => {
        const { currentDocId } = get();
        if (!currentDocId) return;

        // Force refetch by clearing current doc ID temporarily
        set({ currentDocId: null });
        await get().fetchSourceDocumentDetail(currentDocId);
    },

    clearState: () => {
        set({
            currentDocId: null,
            doc: null,
            loading: false,
            error: ''
        });
    },

    clearError: () => {
        set({ error: '' });
    },
}));

// Convenience hook that provides the same interface as the old useSourceDocumentDetail
export const useSourceDocumentDetail = (id: string) => {
    const store = useSourceDocumentDetailStore();

    // Fetch data when id changes
    useEffect(() => {
        if (id) {
            store.fetchSourceDocumentDetail(id);
        } else {
            store.clearState();
        }
    }, [id, store.fetchSourceDocumentDetail]);

    return {
        doc: store.doc,
        loading: store.loading,
        error: store.error,
        setDoc: store.updateDoc,
        refetch: store.refetch,
    };
};
