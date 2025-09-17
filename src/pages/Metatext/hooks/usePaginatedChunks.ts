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
    processedChunks: ChunkType[];
    initialChunksPerPage?: number;
}

interface UsePaginatedChunksResult {
    displayChunks: ChunkType[];
    totalFilteredChunks: number;
    chunksPerPage: number;
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    startIndex: number;
    endIndex: number;
    goToChunkById: (chunkId: number) => void;
    scrollToChunk: (chunkId: number) => void;
}

export function usePaginatedChunks({
    processedChunks,
    initialChunksPerPage = 5
}: UsePaginatedChunksOptions): UsePaginatedChunksResult {

    const pager = useChunkPagination(processedChunks, {
        initialPage: 1,
        initialChunksPerPage
    });

    // Listen for navigation requests from other components (e.g., bookmark navigation)
    const requestedChunkId = useChunkNavigationStore(state => state.requestedChunkId);
    const clearNavigationRequest = useChunkNavigationStore(state => state.clearNavigationRequest);

    // Handle navigation requests
    useEffect(() => {
        if (requestedChunkId !== null) {
            pager.goToChunkById(requestedChunkId);
            clearNavigationRequest();
        }
    }, [requestedChunkId, pager.goToChunkById, clearNavigationRequest]);

    // When the filtered set changes, ensure current page is valid
    useEffect(() => {
        const totalPages = pager.totalPages || 1;
        if (pager.currentPage > totalPages) {
            pager.setCurrentPage(Math.max(1, totalPages));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pager.totalFilteredChunks, pager.chunksPerPage]);

    // Provide a safe clamped setter so callers don't need to worry about invalid pages
    const setCurrentPageSafe = useCallback((page: number) => {
        const totalPages = pager.totalPages || 1;
        const clamped = Math.max(1, Math.min(page, totalPages));
        pager.setCurrentPage(clamped);
    }, [pager.totalPages, pager.setCurrentPage]);

    return {
        displayChunks: pager.displayChunks,
        totalFilteredChunks: pager.totalFilteredChunks,
        chunksPerPage: pager.chunksPerPage,
        currentPage: pager.currentPage,
        totalPages: pager.totalPages,
        setCurrentPage: setCurrentPageSafe,
        startIndex: pager.startIndex,
        endIndex: pager.endIndex,
        goToChunkById: pager.goToChunkById,
        scrollToChunk: pager.scrollToChunk,
    };
}