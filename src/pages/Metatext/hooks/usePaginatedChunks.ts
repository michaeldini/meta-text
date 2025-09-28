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

interface UsePaginatedChunksOptions {
    /** The processed chunks to paginate */
    processedChunks: ChunkType[];
    /** Initial number of chunks per page */
    initialChunksPerPage?: number;
}

interface UsePaginatedChunksResult {
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
}

/**
 * Custom hook to manage paginated chunks with automatic page adjustment
 */
export function usePaginatedChunks({
    processedChunks,
    initialChunksPerPage = 5
}: UsePaginatedChunksOptions): UsePaginatedChunksResult {

    /**
     * Use the chunk pagination hook to manage pagination state and logic.
     */
    const pager = useChunkPagination(processedChunks, 1, initialChunksPerPage);

    // Listen for navigation requests from other components (e.g., bookmark navigation)
    const requestedChunkId = useChunkNavigationStore(state => state.requestedChunkId);
    const clearNavigationRequest = useChunkNavigationStore(state => state.clearNavigationRequest);

    // Handle navigation requests
    useEffect(() => {
        if (requestedChunkId !== null) {
            pager.goToChunkById(requestedChunkId);
            clearNavigationRequest();
        }
        // Only depend on the specific pager method we use, not the entire pager object
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestedChunkId, pager.goToChunkById, clearNavigationRequest]);

    // When the filtered set changes, ensure current page is valid
    useEffect(() => {
        const totalPages = pager.totalPages || 1;
        if (pager.currentPage > totalPages) {
            pager.setCurrentPage(Math.max(1, totalPages));
        }
        // Only depend on the specific pager properties we read, not the entire pager object
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pager.totalFilteredChunks, pager.chunksPerPage, pager.currentPage, pager.totalPages, pager.setCurrentPage]);

    // Provide a safe clamped setter so callers don't need to worry about invalid pages
    const setCurrentPageSafe = useCallback((page: number) => {
        const totalPages = pager.totalPages || 1;
        const clamped = Math.max(1, Math.min(page, totalPages));
        pager.setCurrentPage(clamped);
        // Only depend on the specific pager properties we read, not the entire pager object
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pager.totalPages, pager.setCurrentPage]);

    // Navigation functions for next/previous page
    const nextPage = useCallback(() => {
        const totalPages = pager.totalPages || 1;
        if (pager.currentPage < totalPages) {
            pager.setCurrentPage(pager.currentPage + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pager.currentPage, pager.totalPages, pager.setCurrentPage]);

    const prevPage = useCallback(() => {
        if (pager.currentPage > 1) {
            pager.setCurrentPage(pager.currentPage - 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pager.currentPage, pager.setCurrentPage]);

    return {
        displayChunks: pager.displayChunks,
        totalFilteredChunks: pager.totalFilteredChunks,
        chunksPerPage: pager.chunksPerPage,
        currentPage: pager.currentPage,
        totalPages: pager.totalPages,
        setCurrentPage: setCurrentPageSafe,
        nextPage,
        prevPage,
        startIndex: pager.startIndex,
        endIndex: pager.endIndex,
        goToChunkById: pager.goToChunkById,
    };
}