import { create } from 'zustand';

import { fetchSourceDocument } from 'services';

import { getErrorMessage } from '../types/error';
import type { SourceDocumentDetail } from 'types';

interface SourceDocumentDetailState {
    // Current document being viewed
    currentDocId: number | null;
    doc: SourceDocumentDetail | null;
    loading: boolean;
    error: string;

    // Actions
    fetchSourceDocumentDetail: (id: number) => Promise<void>;
    updateDoc: (doc: SourceDocumentDetail) => void;
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

    fetchSourceDocumentDetail: async (id: number) => {
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
            const doc = await fetchSourceDocument(String(id));
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

    updateDoc: (doc: SourceDocumentDetail) => {
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
