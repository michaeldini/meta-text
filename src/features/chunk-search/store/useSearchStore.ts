/**
 * Search system architecture:
 * - useSearchStore.ts: Zustand store holding all search state, actions, and the core searchChunks logic.
 * - useSearch.ts: Custom hook that debounces search input and delegates search execution to the store.
 * - useSearchKeyboard.ts: Hook for keyboard shortcuts (focus, clear, etc), using useSearch for clearing and useSearchStore for state.
 * 
 * This structure centralizes search logic in the store, keeps UI logic in hooks, and ensures maintainable, DRY search behavior across the app.
 */
import { create } from 'zustand';
import type { ChunkType } from '@mtypes/documents';

import log from '@utils/logger'

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

    // New: search logic centralized in store
    searchChunks: (query: string, tags: string[], chunks: ChunkType[], minQueryLength?: number) => void;
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

    // Centralized search logic
    searchChunks: (query, tags, chunks, minQueryLength = 2) => {
        if (query.length < minQueryLength) {
            get().clearSearch();
            return;
        }

        set({ isSearching: true });

        try {
            const searchTermLower = query.toLowerCase();
            const matchingChunks: ChunkType[] = [];

            log.info(`Searching for "${query}" in ${chunks.length} chunks`);

            for (const chunk of chunks) {
                const chunkText = chunk.text || '';
                const chunkTextLower = chunkText.toLowerCase();
                if (chunkTextLower.includes(searchTermLower)) {
                    log.info(`Found match in chunk ${chunk.id}: "${query}"`);
                    matchingChunks.push(chunk);
                }
            }

            get().setFilteredChunks(matchingChunks, query);
            log.info(`Search completed: ${matchingChunks.length} chunks found`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Search failed';
            log.error('Search error:', errorMessage);
            get().clearSearch();
        } finally {
            set({ isSearching: false });
        }
    },
}));
