// Hook for performing search operations on local chunk data
// Searches through chunks and populates filtered chunk store for main display

import { useState, useEffect, useCallback } from 'react';
import { useSearchStore } from '../store/useSearchStore';
import { useChunkStore } from '../../../store/chunkStore';
import type { ChunkType } from '../../../types';
import log from '../../../utils/logger';

interface UseSearchOptions {
    debounceMs?: number;
    minQueryLength?: number;
}

export const useSearch = (options: UseSearchOptions = {}) => {
    const { debounceMs = 300, minQueryLength = 2 } = options;
    const [error, setError] = useState<string | null>(null);

    const {
        query,
        activeTags,
        setSearching,
        clearSearch,
        clearResults,
        isSearching,
        setFilteredChunks
    } = useSearchStore();

    // Get chunks from the chunk store
    const { chunks } = useChunkStore();

    const performSearch = useCallback((searchQuery: string, tags: string[]) => {
        if (searchQuery.length < minQueryLength) {
            clearSearch();
            return;
        }

        setSearching(true);
        setError(null);

        try {
            const searchTermLower = searchQuery.toLowerCase();
            const matchingChunks: ChunkType[] = [];

            log.info(`Searching for "${searchQuery}" in ${chunks.length} chunks`);

            // Search through chunks
            for (const chunk of chunks) {
                const chunkText = chunk.text || '';
                const chunkTextLower = chunkText.toLowerCase();

                // Check if the search term exists in this chunk
                if (chunkTextLower.includes(searchTermLower)) {
                    log.info(`Found match in chunk ${chunk.id}: "${searchQuery}"`);
                    matchingChunks.push(chunk);
                }
            }

            // Set filtered chunks for main display
            setFilteredChunks(matchingChunks, searchQuery);

            log.info(`Search completed: ${matchingChunks.length} chunks found`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Search failed';
            log.error('Search error:', errorMessage);
            setError(errorMessage);
            clearSearch();
        } finally {
            setSearching(false);
        }
    }, [chunks, minQueryLength, setSearching, setFilteredChunks, setError]); // Removed clearSearch from dependencies

    // Clear search and filtered chunks
    const handleClearSearch = useCallback(() => {
        clearSearch();
    }, []); // clearSearch is stable from Zustand

    // Debounced search effect
    useEffect(() => {
        if (!query.trim()) {
            // Clear results when query is empty, but don't clear the query itself
            clearResults();
            return;
        }

        const timeoutId = setTimeout(() => {
            performSearch(query, activeTags);
        }, debounceMs);

        return () => clearTimeout(timeoutId);
    }, [query, activeTags, performSearch, debounceMs]); // Zustand actions are stable, so clearResults shouldn't cause issues, but removing to be safe

    return {
        error,
        isSearching,
        clearSearch: handleClearSearch
    };
};
