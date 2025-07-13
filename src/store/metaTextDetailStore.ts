import { create } from 'zustand';
import { fetchMetaText } from 'services';
import { getErrorMessage } from 'types';
import type { MetaTextDetail } from 'types';
// import { useChunkStore } from './chunkStore';

interface MetaTextDetailErrors {
    metatext: string;
}

interface MetaTextDetailState {
    // Current MetaText being viewed
    currentMetaTextId: string | null;
    metatext: MetaTextDetail | null;

    // Loading states
    loading: boolean;

    // Error states
    errors: MetaTextDetailErrors;

    // Actions
    fetchMetaTextDetail: (metatextId: string) => Promise<void>;
    clearState: () => void;
    clearErrors: () => void;
}

export const useMetaTextDetailStore = create<MetaTextDetailState>((set, get) => {
    // const setChunks = useChunkStore.getState().setChunks;
    return {
        // Initial state
        currentMetaTextId: null,
        metatext: null,
        loading: false,
        errors: { metatext: '' },

        fetchMetaTextDetail: async (metatextId: string) => {
            // Don't refetch if we're already viewing this MetaText
            const { currentMetaTextId } = get();
            if (currentMetaTextId === metatextId) return;

            set({
                loading: true,
                errors: { metatext: '' },
                currentMetaTextId: metatextId,
                metatext: null
            });

            try {
                if (!metatextId) {
                    throw new Error('No metatextId provided');
                }

                const metatext = await fetchMetaText(Number(metatextId));
                if (!metatext) {
                    throw new Error(`MetaText with ID ${metatextId} not found`);
                }

                set({ metatext, loading: false });

            } catch (error: unknown) {
                set({
                    loading: false,
                    errors: {
                        metatext: getErrorMessage(error, 'Failed to load meta text.')
                    }
                });
            }
        },
        clearState: () => {
            set({
                currentMetaTextId: null,
                metatext: null,
                loading: false,
                errors: { metatext: '' }
            });
        },
        clearErrors: () => {
            set({ errors: { metatext: '' } });
        },
    };
});
