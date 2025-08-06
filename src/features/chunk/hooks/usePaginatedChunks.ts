// Custom hook to encapsulate business logic for paginated chunks
// Handles filtering, pagination, fetching, and bookmark navigation
import React, { useRef, useEffect, useCallback } from 'react';
import { useChunksQuery } from '@hooks/useChunksQuery';
import { useSearchStore } from '@features/chunk-search/store/useSearchStore';

import { usePaginationStore } from './usePaginationStore';
import { ChunkType } from '@mtypes/documents';

interface UsePaginatedChunksProps {
    metatextId: number | null;
    showOnlyFavorites?: boolean;
}
export function usePaginatedChunks({ metatextId, showOnlyFavorites }: UsePaginatedChunksProps) {
    if (!metatextId) {
        return {
            paginatedChunks: [],
            displayChunks: [],
            loadingChunks: false,
            chunksError: null,
            currentPage: 1,
            setCurrentPage: () => { },
            chunksPerPage: 5,
            pageCount: 0,
            startIdx: 0,
            endIdx: 0,
            bookmarkedChunkId: null,
        };
    }
    // Use React Query for chunk data
    const { data: chunks = [], isLoading: loadingChunks, error: chunksError } = useChunksQuery(Number(metatextId));
    const { filteredChunks, isInSearchMode } = useSearchStore();
    const { currentPage, setCurrentPage, setChunksPerPage } = usePaginationStore();

    // Combine search and favorite filters
    let displayChunks = isInSearchMode ? filteredChunks : chunks;
    if (showOnlyFavorites) {
        displayChunks = displayChunks.filter((chunk: any) => !!chunk.favorited_by_user_id);
    }


    // Pagination logic
    const chunksPerPage = 5;
    useEffect(() => {
        setChunksPerPage(chunksPerPage);
    }, [setChunksPerPage]);

    const pageCount = displayChunks.length;
    const startIdx = (currentPage - 1) * chunksPerPage;
    const endIdx = startIdx + chunksPerPage;
    const paginatedChunks = displayChunks.slice(startIdx, endIdx);

    // Reset currentPage to 1 if the current page is out of bounds after filtering (e.g., toggling favorites/search)
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

    // Find the first bookmarked chunk by user
    const bookmarkedChunk = displayChunks.find((chunk: ChunkType) => !!chunk.bookmarked_by_user_id);
    const bookmarkedChunkId = bookmarkedChunk ? bookmarkedChunk.id : null;
    // Handle navigation to bookmarked chunk using custom hook
    // if (typeof metatextId === 'number') {
    //     useChunkBookmarkNavigation(metatextId, displayChunks, chunksPerPage, setCurrentPage);
    // }

    // Preserve previous chunks for scroll position
    const prevChunksRef = useRef<any[]>([]);
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
