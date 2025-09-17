/**
 * useProcessedChunks - Handles search and filtering of chunks
 * 
 * Combines search and favorites filtering into a clean interface.
 * Returns the filtered chunks ready for pagination.
 */

import { useMemo } from 'react';
import { useChunkFiltersStore } from '@features/chunk/hooks/useChunkFiltersStore';
import { useSearchStore } from '@features/chunk-search/store/useSearchStore';
import { ChunkType } from '@mtypes/documents';
import { useChunkSearch } from '@features/chunk/hooks/useChunkSearch';
import { useChunkFilters } from '@features/chunk/hooks/useChunkFilters';

interface UseProcessedChunksOptions {
    chunks: ChunkType[] | undefined;
    minQueryLength?: number;
}

interface UseProcessedChunksResult {
    processedChunks: ChunkType[];
    isSearching: boolean;
    showOnlyFavorites: boolean;
    setShowOnlyFavorites: (show: boolean) => void;
}

export function useProcessedChunks({
    chunks,
    minQueryLength = 2
}: UseProcessedChunksOptions): UseProcessedChunksResult {
    // Get search state from store
    const { query } = useSearchStore();
    const { results: searchResults, isSearching } = useChunkSearch(chunks, query);

    // Get favorites filter state from store
    const showOnlyFavorites = useChunkFiltersStore((s) => s.showOnlyFavorites);
    const setShowOnlyFavorites = useChunkFiltersStore((s) => s.setShowOnlyFavorites);

    // Combine search and filters
    const baseList = useMemo(() => {
        return (query && query.length >= minQueryLength) ? searchResults : (chunks ?? []);
    }, [query, minQueryLength, searchResults, chunks]);

    const { filtered } = useChunkFilters(baseList, showOnlyFavorites);

    return {
        processedChunks: filtered,
        isSearching,
        showOnlyFavorites,
        setShowOnlyFavorites,
    };
}