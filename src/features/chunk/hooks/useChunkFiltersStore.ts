import { create } from 'zustand';

interface ChunkFiltersState {
    showOnlyFavorites: boolean;
    setShowOnlyFavorites: (show: boolean) => void;

    // Reset all display state (useful when switching metatexts)
    resetDisplayState: () => void;
}

const initialState = {
    showOnlyFavorites: false,
};

export const useChunkFiltersStore = create<ChunkFiltersState>((set) => ({
    ...initialState,

    setShowOnlyFavorites: (show: boolean) => set({ showOnlyFavorites: show }),

    resetDisplayState: () => set(initialState),
}));
