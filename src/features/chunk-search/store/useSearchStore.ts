// Consolidated store for managing all search state and filtered chunks
// Handles search input, filtering, results, and navigation

import { create } from 'zustand';
import type { ChunkType } from '../../../types';

interface SearchAndFilterState {
    // Input state (formerly in useSearchStore)
    query: string;
    isSearching: boolean;
    activeTags: string[];

    // Results state
    filteredChunks: ChunkType[];
    isInSearchMode: boolean;
    totalMatches: number;

    // Input actions
    setQuery: (query: string) => void;
    setSearching: (isSearching: boolean) => void;
    toggleTag: (tag: string) => void;

    // Results actions
    setFilteredChunks: (chunks: ChunkType[], query: string) => void;
    clearSearch: () => void;
    clearResults: () => void;
}

export const useSearchStore = create<SearchAndFilterState>((set, get) => ({
    // Input state
    query: '',
    isSearching: false,
    activeTags: [],

    // Results state
    filteredChunks: [],
    isInSearchMode: false,
    totalMatches: 0,

    // Input actions
    setQuery: (query: string) => set({
        query
    }),

    setSearching: (isSearching: boolean) => set({ isSearching }),

    toggleTag: (tag: string) => set((state) => ({
        activeTags: state.activeTags.includes(tag)
            ? state.activeTags.filter(t => t !== tag)
            : [...state.activeTags, tag]
    })),

    // Results actions
    setFilteredChunks: (chunks: ChunkType[], query: string) => {
        // Count total matches across all chunks
        const totalMatches = chunks.reduce((total, chunk) => {
            const text = chunk.text.toLowerCase();
            const searchTerm = query.toLowerCase();
            const matches = text.split(searchTerm).length - 1;
            return total + matches;
        }, 0);

        set({
            filteredChunks: chunks,
            isInSearchMode: true,
            totalMatches
            // Don't update query here - it should only be updated by user input
        });
    },

    clearSearch: () => set({
        query: '',
        activeTags: [],
        filteredChunks: [],
        isInSearchMode: false,
        totalMatches: 0
    }),

    clearResults: () => set({
        filteredChunks: [],
        isInSearchMode: false,
        totalMatches: 0
    }),
}));
