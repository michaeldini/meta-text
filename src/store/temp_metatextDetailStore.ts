import { create } from 'zustand';
import { fetchMetatext } from 'services';
import { getErrorMessage } from 'types';
import type { MetatextDetail } from 'types';
// import { useChunkStore } from './chunkStore';

interface MetatextDetailErrors {
    metatext: string;
}

interface MetatextDetailState {
    // Current Metatext being viewed
    currentMetatextId: string | null;
    metatext: MetatextDetail | null;

    // Loading states
    loading: boolean;

    // Error states
    errors: MetatextDetailErrors;

    // Actions
    fetchMetatextDetail: (metatextId: string) => Promise<void>;
    clearState: () => void;
    clearErrors: () => void;
}

export const useMetatextDetailStore = create<MetatextDetailState>((set, get) => {
    // const setChunks = useChunkStore.getState().setChunks;
    return {
        // Initial state
        currentMetatextId: null,
        metatext: null,
        loading: false,
        errors: { metatext: '' },

        fetchMetatextDetail: async (metatextId: string) => {
            // Don't refetch if we're already viewing this Metatext
            const { currentMetatextId } = get();
            if (currentMetatextId === metatextId) return;

            set({
                loading: true,
                errors: { metatext: '' },
                currentMetatextId: metatextId,
                metatext: null
            });

            try {
                if (!metatextId) {
                    throw new Error('No metatextId provided');
                }

                const metatext = await fetchMetatext(Number(metatextId));
                if (!metatext) {
                    throw new Error(`Metatext with ID ${metatextId} not found`);
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
                currentMetatextId: null,
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
