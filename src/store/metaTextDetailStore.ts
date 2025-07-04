import { create } from 'zustand';
import { fetchMetaText } from 'services';
import { getErrorMessage } from 'types';
import type { MetaTextDetail } from 'types';
import { useChunkStore } from './chunkStore';
import { useEffect } from 'react';

interface MetaTextDetailErrors {
    metaText: string;
}

interface MetaTextDetailState {
    // Current MetaText being viewed
    currentMetaTextId: string | null;
    metaText: MetaTextDetail | null;

    // Loading states
    loading: boolean;

    // Error states
    errors: MetaTextDetailErrors;

    // Actions
    fetchMetaTextDetail: (metaTextId: string) => Promise<void>;
    clearState: () => void;
    clearErrors: () => void;
}

export const useMetaTextDetailStore = create<MetaTextDetailState>((set, get) => {
    const setChunks = useChunkStore.getState().setChunks;
    return {
        // Initial state
        currentMetaTextId: null,
        metaText: null,
        loading: false,
        errors: { metaText: '' },

        fetchMetaTextDetail: async (metaTextId: string) => {
            // Don't refetch if we're already viewing this MetaText
            const { currentMetaTextId } = get();
            if (currentMetaTextId === metaTextId) return;

            set({
                loading: true,
                errors: { metaText: '' },
                currentMetaTextId: metaTextId,
                metaText: null
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
                // Set chunks in chunk store if metaText and chunks exist
                if (metaText && Array.isArray(metaText.chunks)) {
                    setChunks(metaText.chunks);
                }
            } catch (error: unknown) {
                set({
                    loading: false,
                    errors: {
                        metaText: getErrorMessage(error, 'Failed to load meta text.')
                    }
                });
            }
        },
        clearState: () => {
            set({
                currentMetaTextId: null,
                metaText: null,
                loading: false,
                errors: { metaText: '' }
            });
        },
        clearErrors: () => {
            set({ errors: { metaText: '' } });
        },
    };
});

// Convenience hook for MetaText detail only
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
        loading: store.loading,
        errors: store.errors,
    };
};
