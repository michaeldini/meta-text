/**
 * Store for managing chunk display state including pagination and filtering
 * Consolidates all chunk display-related state in one place for better cohesion
 */

import { create } from 'zustand';

interface DisplayChunksState {
    // Pagination
    currentPage: number;
    chunksPerPage: number;
    setCurrentPage: (page: number) => void;
    setChunksPerPage: (chunksPerPage: number) => void;

    // Filtering
    showOnlyFavorites: boolean;
    setShowOnlyFavorites: (show: boolean) => void;

    // Navigation helpers
    getPageForChunkIndex: (chunkIndex: number) => number;
    navigateToChunkByIndex: (chunkIndex: number) => void;

    // Reset all display state (useful when switching metatexts)
    resetDisplayState: () => void;
}

const initialState = {
    currentPage: 1,
    chunksPerPage: 5,
    showOnlyFavorites: false,
};

export const useDisplayChunksStore = create<DisplayChunksState>((set, get) => ({
    ...initialState,

    setCurrentPage: (page: number) => set({ currentPage: page }),

    setChunksPerPage: (chunksPerPage: number) => set({ chunksPerPage }),

    setShowOnlyFavorites: (show: boolean) => set({ showOnlyFavorites: show }),

    getPageForChunkIndex: (chunkIndex: number) => {
        const { chunksPerPage } = get();
        return Math.floor(chunkIndex / chunksPerPage) + 1; // Pages are 1-indexed
    },

    navigateToChunkByIndex: (chunkIndex: number) => {
        const { getPageForChunkIndex, setCurrentPage } = get();
        const targetPage = getPageForChunkIndex(chunkIndex);
        setCurrentPage(targetPage);
    },

    resetDisplayState: () => set(initialState),
}));
