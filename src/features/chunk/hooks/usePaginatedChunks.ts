// Custom hook to encapsulate business logic for paginated chunks
// Handles filtering, pagination, fetching, and bookmark navigation
import React, { useRef, useEffect, useCallback } from 'react';
import { useChunksQuery } from '@hooks/useChunksQuery';
import { useSearchStore } from '@features/chunk-search/store/useSearchStore';

import { usePaginationStore } from './usePaginationStore';
import { ChunkType } from '@mtypes/documents';

interface UsePaginatedChunksProps {
    chunks: ChunkType[];
    showOnlyFavorites?: boolean;
}
export function usePaginatedChunks({ chunks, showOnlyFavorites }: UsePaginatedChunksProps) {
    // Always call hooks first to follow Rules of Hooks
    const { filteredChunks, isInSearchMode } = useSearchStore();
    const { currentPage, setCurrentPage, setChunksPerPage } = usePaginationStore();
    const prevChunksRef = useRef<any[]>([]);

    // Default values
    const loadingChunks = false;
    const chunksError = null;
    const chunksPerPage = 5;
    let displayChunks: ChunkType[] = [];
    let paginatedChunks: ChunkType[] = [];
    let pageCount = 0;
    let startIdx = 0;
    let endIdx = 0;
    let bookmarkedChunkId = null;

    if (chunks && chunks.length > 0) {
        displayChunks = isInSearchMode ? filteredChunks : chunks;
        if (showOnlyFavorites) {
            displayChunks = displayChunks.filter((chunk: any) => !!chunk.favorited_by_user_id);
        }
        pageCount = displayChunks.length;
        startIdx = (currentPage - 1) * chunksPerPage;
        endIdx = startIdx + chunksPerPage;
        paginatedChunks = displayChunks.slice(startIdx, endIdx);
        const bookmarkedChunk = displayChunks.find((chunk: ChunkType) => !!chunk.bookmarked_by_user_id);
        bookmarkedChunkId = bookmarkedChunk ? bookmarkedChunk.id : null;
    }

    useEffect(() => {
        setChunksPerPage(chunksPerPage);
    }, [setChunksPerPage]);

    useEffect(() => {
        if (currentPage > Math.ceil(pageCount / chunksPerPage) && pageCount > 0) {
            setCurrentPage(1);
        }
    }, [displayChunks, pageCount, currentPage, setCurrentPage, chunksPerPage]);

    // Wrapper for bookmark navigation to handle the setCurrentPage signature
    const handlePageChange = useCallback((page: React.SetStateAction<number>) => {
        if (typeof page === 'function') {
            setCurrentPage(page(currentPage));
        } else {
            setCurrentPage(page);
        }
    }, [currentPage, setCurrentPage]);

    // Preserve previous chunks for scroll position
    useEffect(() => {
        prevChunksRef.current = displayChunks;
    }, [displayChunks]);

    return {
        paginatedChunks,
        displayChunks,
        loadingChunks,
        chunksError,
        currentPage,
        setCurrentPage,
        chunksPerPage,
        pageCount,
        startIdx,
        endIdx,
        bookmarkedChunkId,
    };
}
