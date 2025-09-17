/**
 * Search system architecture (updated):
 * - useSearchStore.ts: Simple store for search UI state (query, clearing)
 * - useProcessedChunks.ts: Focused hook that handles search execution and filtering
 * - usePaginatedChunks.ts: Focused hook that handles pagination of processed chunks
 * 
 * This simplified structure moves search logic to focused hooks while keeping 
 * UI state (query) in the store for sharing across components.
 */
import { create } from 'zustand';

interface SearchState {
    // Input state
    query: string;

    // Actions
    setQuery: (query: string) => void;
    clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    // Input state
    query: '',

    // Actions
    setQuery: (query: string) => set({ query }),

    clearSearch: () => set({ query: '' }),
}));
