/**
 * Search system architecture (updated):
 * - useSearchStore.ts: Simple store for search UI state (query, clearing)
 * - useChunkDisplay.ts: Unified hook that handles search execution, filtering, pagination, and display
 * - Search keyboard shortcuts are now unified in useMetatextDetailKeyboard.ts
 * 
 * This simplified structure moves search logic to where it's consumed (useChunkDisplay)
 * while keeping UI state (query) in the store for sharing across components.
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
