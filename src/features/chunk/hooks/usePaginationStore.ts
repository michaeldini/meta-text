// Store for managing pagination state that can be shared across components
// Allows search navigation to control pagination

import { create } from 'zustand';

interface PaginationState {
    currentPage: number;
    chunksPerPage: number;
    setCurrentPage: (page: number) => void;
    setChunksPerPage: (chunksPerPage: number) => void;

    // Method to calculate which page a chunk index is on
    getPageForChunkIndex: (chunkIndex: number) => number;

    // Method to navigate to a specific chunk by its global index
    navigateToChunkByIndex: (chunkIndex: number) => void;
}

export const usePaginationStore = create<PaginationState>((set, get) => ({
    currentPage: 1,
    chunksPerPage: 5,

    setCurrentPage: (page: number) => set({ currentPage: page }),

    setChunksPerPage: (chunksPerPage: number) => set({ chunksPerPage }),

    getPageForChunkIndex: (chunkIndex: number) => {
        const { chunksPerPage } = get();
        return Math.floor(chunkIndex / chunksPerPage) + 1; // Pages are 1-indexed
    },

    navigateToChunkByIndex: (chunkIndex: number) => {
        const { getPageForChunkIndex, setCurrentPage } = get();
        const targetPage = getPageForChunkIndex(chunkIndex);
        setCurrentPage(targetPage);
    }
}));
