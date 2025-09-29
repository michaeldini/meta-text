/**
 * Search system architecture (updated):
 * - useSearchStore.ts: Simple store for search UI state (query, clearing)


 * 
 * This simplified structure moves search logic to focused hooks while keeping 
 * UI state (query) in the store for sharing across components.
 */
import { create } from 'zustand';

interface SearchState {
    // Input state
    query: string;

    // Reference to the input element (optional)
    searchInput?: HTMLInputElement | null;

    // Actions
    setQuery: (query: string) => void;
    clearSearch: () => void;

    // Register the input element so other code can focus it
    registerSearchInput: (el: HTMLInputElement | null) => void;

    // Focus helper that prefers the registered input but falls back to a stable id
    focusSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
    // Input state
    query: '',

    // Input element (not set initially)
    searchInput: undefined,

    // Actions
    setQuery: (query: string) => set({ query }),

    clearSearch: () => set({ query: '' }),

    registerSearchInput: (el: HTMLInputElement | null) => set({ searchInput: el }),

    focusSearch: () => {
        const state = get();
        const el = state.searchInput ?? document.getElementById('metatext-search-input') as HTMLInputElement | null;
        el?.focus();
    },
}));
