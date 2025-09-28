/**
 * usePaginatedChunks - Handles pagination with automatic page adjustment
 * 
 * Takes processed chunks and provides pagination interface with safe page management.
 * Listens for chunk navigation requests and handles them automatically.
 */

import { useCallback, useEffect } from 'react';
import { ChunkType } from '@mtypes/documents';
import { useChunkPagination } from '@features/chunk/hooks/useChunkPagination';
import { useChunkNavigationStore } from '@store/chunkNavigationStore';

interface UseChunkPaginationWithNavigationProps {
    /** The processed chunks to paginate */
    processedChunks: ChunkType[];
    /** Initial number of chunks per page */
    initialChunksPerPage?: number;
}

interface UseChunkPaginationWithNavigationResult {
    /** The chunks to be displayed on the current page. */
    displayChunks: ChunkType[];
    /** Total number of chunks after filtering/searching. */
    totalFilteredChunks: number;
    /** Number of chunks per page. */
    chunksPerPage: number;
    /** Current page number. */
    currentPage: number;
    /** Total number of pages. */
    totalPages: number;
    /** Set the current page number. */
    setCurrentPage: (page: number) => void;
    /** Navigate to the next page. */
    nextPage: () => void;
    /** Navigate to the previous page. */
    prevPage: () => void;
    /** The index of the first chunk on the current page (0-based). */
    startIndex: number;
    /** The index of the last chunk on the current page (0-based). */
    endIndex: number;
    /** Navigate to a specific chunk by its ID. */
    goToChunkById: (chunkId: number) => void;
    /** Whether there is a previous page available. */
    hasPrev: boolean;
    /** Whether there is a next page available. */
    hasNext: boolean;
    /** Alias for a safe clamped page jump (1-based). */
    gotoPage: (page: number) => void;
}

/**
 * Custom hook to manage paginated chunks with automatic page adjustment
 */
export function useChunkPaginationWithNavigation({
    processedChunks,
    initialChunksPerPage = 5
}: UseChunkPaginationWithNavigationProps): UseChunkPaginationWithNavigationResult {

    /**
     * Use the chunk pagination hook to manage pagination state and logic.
     */
    const pager = useChunkPagination(processedChunks, 1, initialChunksPerPage);

    // Listen for navigation requests from other components (e.g., bookmark navigation)
    const requestedChunkId = useChunkNavigationStore(state => state.requestedChunkId);
    const clearNavigationRequest = useChunkNavigationStore(state => state.clearNavigationRequest);

    // Handle navigation requests (pager.goToChunkById is stable)
    useEffect(() => {
        if (requestedChunkId !== null) {
            pager.goToChunkById(requestedChunkId);
            clearNavigationRequest();
        }
    }, [requestedChunkId, pager.goToChunkById, clearNavigationRequest]);

    // Remove redundant clamping effect; core hook owns page safety now.

    // Navigation functions for next/previous page
    const nextPage = useCallback(() => {
        if (pager.currentPage < pager.totalPages) {
            pager.setCurrentPage(pager.currentPage + 1);
        }
    }, [pager.currentPage, pager.totalPages, pager.setCurrentPage]);

    const prevPage = useCallback(() => {
        if (pager.currentPage > 1) {
            pager.setCurrentPage(pager.currentPage - 1);
        }
    }, [pager.currentPage, pager.setCurrentPage]);

    return {
        displayChunks: pager.displayChunks,
        totalFilteredChunks: pager.totalFilteredChunks,
        chunksPerPage: pager.chunksPerPage,
        currentPage: pager.currentPage,
        totalPages: pager.totalPages,
        setCurrentPage: pager.setCurrentPageSafe,
        nextPage,
        prevPage,
        startIndex: pager.startIndex,
        endIndex: pager.endIndex,
        goToChunkById: pager.goToChunkById,
        hasPrev: pager.hasPrev,
        hasNext: pager.hasNext,
        gotoPage: pager.setCurrentPageSafe,
    };
}