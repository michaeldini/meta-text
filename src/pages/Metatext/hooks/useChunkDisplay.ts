/**
 * useChunkDisplay - Unified hook for chunk search, filtering, pagination, and display
 * 
 * @deprecated This hook does too much and violates Single Responsibility Principle.
 * Use useProcessedChunks + usePaginatedChunks instead for better separation of concerns.
 * 
 * Combines search filtering, favorites filtering, and pagination into a single
 * streamlined interface. Integrates search logic directly instead of relying
 * on a separate search store for better cohesion and simpler architecture.
 */

import { useEffect, useMemo, useCallback } from 'react';
import { useChunkFiltersStore } from '@features/chunk/hooks/useChunkFiltersStore';
import { useSearchStore } from '@features/chunk-search/store/useSearchStore';
import { ChunkType } from '@mtypes/documents';
import { useChunkSearch } from '@features/chunk/hooks/useChunkSearch';
import { useChunkPagination } from '@features/chunk/hooks/useChunkPagination';
import { useChunkFilters } from '@features/chunk/hooks/useChunkFilters';

interface UseChunkDisplayOptions {
    chunks: ChunkType[] | undefined;
    chunksPerPage?: number;
    // Optional explicit inputs to avoid implicit global store reads
    query?: string;
    showOnlyFavorites?: boolean;
    setShowOnlyFavorites?: (show: boolean) => void;
    // Behavior controls
    minQueryLength?: number;
}

interface UseChunkDisplayResult {
    // Display data
    displayChunks: ChunkType[];
    totalFilteredChunks: number;
    chunksPerPage: number;

    // Pagination
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    startIndex: number;
    endIndex: number;

    // Navigation
    goToChunkById: (chunkId: number) => void;
    scrollToChunk: (chunkId: number) => void;

    // Filtering
    showOnlyFavorites: boolean;
    setShowOnlyFavorites: (show: boolean) => void;
    isSearching: boolean;
}
export function useChunkDisplay({
    chunks,
    chunksPerPage = 5,
    // new optional params with defaults
    query,
    showOnlyFavorites: showOnlyFavoritesOpt,
    setShowOnlyFavorites: setShowOnlyFavoritesOpt,
    minQueryLength = 2
}: UseChunkDisplayOptions): UseChunkDisplayResult {

    // Get search state from the search store and use the dedicated search hook
    // Prefer explicit inputs; fall back to stores for backwards compatibility
    const { query: queryFromStore } = useSearchStore();
    const queryUsed = typeof query === 'string' ? query : queryFromStore;
    const { results: searchResults, isSearching } = useChunkSearch(chunks, queryUsed);

    // Get favorites toggle from the display store if not explicitly provided
    const showOnlyFavoritesFromStore = useChunkFiltersStore((s) => s.showOnlyFavorites);
    const setShowOnlyFavoritesFromStore = useChunkFiltersStore((s) => s.setShowOnlyFavorites);
    const showOnlyFavorites = typeof showOnlyFavoritesOpt === 'boolean' ? showOnlyFavoritesOpt : showOnlyFavoritesFromStore;
    const setShowOnlyFavorites = setShowOnlyFavoritesOpt ?? setShowOnlyFavoritesFromStore;

    // Search is handled by `useChunkSearch` (debounced) above.

    // Combine search and filters. Decision to use search is configurable via `minQueryLength`.
    const baseList = useMemo(() => (queryUsed && queryUsed.length >= minQueryLength) ? searchResults : (chunks ?? []), [queryUsed, minQueryLength, searchResults, chunks]);
    const { filtered } = useChunkFilters(baseList, showOnlyFavorites);

    // Pagination (fully local): use the chunksPerPage passed into this hook as the initial page size
    const pager = useChunkPagination(filtered, { initialPage: 1, initialChunksPerPage: chunksPerPage });

    // When the filtered set changes (or page size changes), ensure current page is valid.
    useEffect(() => {
        // If the current page is now out of range, clamp it.
        const totalPages = pager.totalPages || 1;
        if (pager.currentPage > totalPages) {
            pager.setCurrentPage(Math.max(1, totalPages));
        }
        // Only depend on the specific pager properties we read, not the entire pager object
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pager.totalFilteredChunks, pager.chunksPerPage, pager.currentPage, pager.totalPages, pager.setCurrentPage]);

    // Provide a safe clamped setter so callers don't need to worry about invalid pages.
    const setCurrentPageSafe = useCallback((page: number) => {
        const totalPages = pager.totalPages || 1;
        const clamped = Math.max(1, Math.min(page, totalPages));
        pager.setCurrentPage(clamped);
        // Only depend on the specific pager properties we read, not the entire pager object
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pager.totalPages, pager.setCurrentPage]);

    return {
        // Display data
        displayChunks: pager.displayChunks,
        totalFilteredChunks: pager.totalFilteredChunks,
        chunksPerPage: pager.chunksPerPage,

        // Pagination
        currentPage: pager.currentPage,
        totalPages: pager.totalPages,
        // Expose the safe setter to consumers
        setCurrentPage: setCurrentPageSafe,
        startIndex: pager.startIndex,
        endIndex: pager.endIndex,

        // Navigation helpers
        goToChunkById: pager.goToChunkById,
        scrollToChunk: pager.scrollToChunk,

        // Filtering
        showOnlyFavorites,
        setShowOnlyFavorites,
        isSearching,
    };
}
