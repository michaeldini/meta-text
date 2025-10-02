/**
 * Store for managing chunk display state including pagination and filtering
 * Consolidates all chunk display-related state in one place for better cohesion
 */

import { create } from 'zustand';

interface DisplayChunksState {
    // Filtering
    showOnlyFavorites: boolean;
    setShowOnlyFavorites: (show: boolean) => void;

    // Reset all display state (useful when switching metatexts)
    resetDisplayState: () => void;
}

const initialState = {
    showOnlyFavorites: false,
};

export const displayChunksStore = create<DisplayChunksState>((set) => ({
    ...initialState,

    setShowOnlyFavorites: (show: boolean) => set({ showOnlyFavorites: show }),

    resetDisplayState: () => set(initialState),
}));
