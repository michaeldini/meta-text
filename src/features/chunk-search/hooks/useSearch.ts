/**
 * Search system architecture:
 * - useSearchStore.ts: Zustand store holding all search state, actions, and the core searchChunks logic.
 * - useSearch.ts: Custom hook that debounces search input and delegates search execution to the store.
 * - useSearchKeyboard.ts: Hook for keyboard shortcuts (focus, clear, etc), using useSearch for clearing and useSearchStore for state.
 * 
 * This structure centralizes search logic in the store, keeps UI logic in hooks, and ensures maintainable, DRY search behavior across the app.
 */
import { useEffect, useCallback, useState } from 'react';
import { useSearchStore } from '../store/useSearchStore';
import { useChunkStore } from '@store/chunkStore';

interface UseSearchOptions {
    debounceMs?: number;
    minQueryLength?: number;
}

export const useSearch = (options: UseSearchOptions = {}) => {
    const { debounceMs = 300, minQueryLength = 2 } = options;
    const [error, setError] = useState<string | null>(null);

    const { query, activeTags, clearSearch, clearResults, isSearching, searchChunks } = useSearchStore();
    const { chunks } = useChunkStore();

    // Debounced search effect
    useEffect(() => {
        if (!query.trim()) {
            clearResults();
            return;
        }
        const timeoutId = setTimeout(() => {
            try {
                searchChunks(query, activeTags, chunks, minQueryLength);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Search failed';
                setError(errorMessage);
            }
        }, debounceMs);
        return () => clearTimeout(timeoutId);
    }, [query, activeTags, chunks, debounceMs, minQueryLength, searchChunks, clearResults]);

    const handleClearSearch = useCallback(() => {
        clearSearch();
    }, [clearSearch]);

    return {
        error,
        isSearching,
        clearSearch: handleClearSearch
    };
};
