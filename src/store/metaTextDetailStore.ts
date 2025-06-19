import { create } from 'zustand';
import { useEffect } from 'react';
import { fetchMetaText } from '../services/metaTextService';
import { fetchSourceDocument } from '../services/sourceDocumentService';
import { getErrorMessage } from '../types/error';
import type { MetaText } from '../types/metaText';
import type { SourceDocument } from '../types/sourceDocument';

interface MetaTextDetailErrors {
    metaText: string;
    sourceDoc: string;
}

interface MetaTextDetailState {
    // Current MetaText being viewed
    currentMetaTextId: string | null;
    metaText: MetaText | null;
    sourceDocInfo: SourceDocument | null;

    // Loading states
    loading: boolean;
    sourceDocLoading: boolean;

    // Error states
    errors: MetaTextDetailErrors;

    // Actions
    fetchMetaTextDetail: (metaTextId: string) => Promise<void>;
    refetchSourceDoc: () => Promise<void>;
    updateSourceDocInfo: (doc: SourceDocument) => void;
    clearState: () => void;
    clearErrors: () => void;
}

export const useMetaTextDetailStore = create<MetaTextDetailState>((set, get) => ({
    // Initial state
    currentMetaTextId: null,
    metaText: null,
    sourceDocInfo: null,
    loading: false,
    sourceDocLoading: false,
    errors: { metaText: '', sourceDoc: '' },

    fetchMetaTextDetail: async (metaTextId: string) => {
        // Don't refetch if we're already viewing this MetaText
        const { currentMetaTextId } = get();
        if (currentMetaTextId === metaTextId) return;

        set({
            loading: true,
            errors: { metaText: '', sourceDoc: '' },
            currentMetaTextId: metaTextId,
            metaText: null,
            sourceDocInfo: null
        });

        try {
            if (!metaTextId) {
                throw new Error('No metaTextId provided');
            }

            const metaText = await fetchMetaText(Number(metaTextId));
            if (!metaText) {
                throw new Error(`MetaText with ID ${metaTextId} not found`);
            }

            set({ metaText, loading: false });

            // Fetch associated source document if it exists
            if (metaText.source_document_id) {
                set({ sourceDocLoading: true });
                try {
                    const sourceDoc = await fetchSourceDocument(String(metaText.source_document_id));
                    set({
                        sourceDocInfo: sourceDoc,
                        sourceDocLoading: false
                    });
                } catch (error: unknown) {
                    set({
                        errors: {
                            metaText: '',
                            sourceDoc: getErrorMessage(error, 'Failed to load source document.')
                        },
                        sourceDocLoading: false
                    });
                }
            }
        } catch (error: unknown) {
            set({
                loading: false,
                errors: {
                    metaText: getErrorMessage(error, 'Failed to load meta text.'),
                    sourceDoc: ''
                }
            });
        }
    },

    refetchSourceDoc: async () => {
        const { metaText } = get();
        if (!metaText?.source_document_id) return;

        set({
            sourceDocLoading: true,
            errors: { ...get().errors, sourceDoc: '' }
        });

        try {
            const doc = await fetchSourceDocument(String(metaText.source_document_id));
            set({
                sourceDocInfo: doc,
                sourceDocLoading: false
            });
        } catch (error: unknown) {
            set({
                sourceDocLoading: false,
                errors: {
                    ...get().errors,
                    sourceDoc: getErrorMessage(error, 'Failed to reload source document.')
                }
            });
        }
    },

    updateSourceDocInfo: (doc: SourceDocument) => {
        set({ sourceDocInfo: doc });
    },

    clearState: () => {
        set({
            currentMetaTextId: null,
            metaText: null,
            sourceDocInfo: null,
            loading: false,
            sourceDocLoading: false,
            errors: { metaText: '', sourceDoc: '' }
        });
    },

    clearErrors: () => {
        set({ errors: { metaText: '', sourceDoc: '' } });
    },
}));

// Convenience hook that provides the same interface as the old useMetaTextDetail
export const useMetaTextDetail = (metaTextId?: string) => {
    const store = useMetaTextDetailStore();

    // Fetch data when metaTextId changes
    useEffect(() => {
        if (metaTextId) {
            store.fetchMetaTextDetail(metaTextId);
        } else {
            store.clearState();
        }
    }, [metaTextId, store.fetchMetaTextDetail]);

    return {
        metaText: store.metaText,
        loading: store.loading || store.sourceDocLoading,
        errors: store.errors,
        sourceDocInfo: store.sourceDocInfo,
        setSourceDocInfo: store.updateSourceDocInfo,
        refetchSourceDoc: store.refetchSourceDoc,
    };
};
