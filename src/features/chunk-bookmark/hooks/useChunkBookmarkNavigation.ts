// Custom hook to handle navigation to a bookmarked chunk
// Extracts the logic from PaginatedChunks to keep the component clean

import React from 'react';
import { useBookmarkUIStore } from '../store/bookmarkStore';
import type { ChunkType } from 'types';
import { findChunkIndex, getChunkPage, scrollToChunk } from '../handlers/bookmarkHandlers';

/**
 * Navigates and scrolls to a bookmarked chunk when triggered.
 * @param chunks - The array of chunks
 * @param chunksPerPage - Number of chunks per page
 * @param setPage - Setter for current page
 * @param bookmarkedChunkId - The id of the bookmarked chunk (from React Query)
 */
const useChunkBookmarkNavigation = (
    chunks: ChunkType[],
    chunksPerPage: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    bookmarkedChunkId: number | null
) => {
    const { navigateToBookmark, clearNavigateToBookmark } = useBookmarkUIStore();

    React.useEffect(() => {
        if (navigateToBookmark && bookmarkedChunkId != null) {
            const idx = findChunkIndex(chunks, bookmarkedChunkId);
            if (idx >= 0) {
                const page = getChunkPage(idx, chunksPerPage);
                setPage(page);
                setTimeout(() => {
                    scrollToChunk(bookmarkedChunkId);
                }, 0);
            }
            clearNavigateToBookmark();
        }
    }, [navigateToBookmark, bookmarkedChunkId, chunks, chunksPerPage, setPage, clearNavigateToBookmark]);
};

export default useChunkBookmarkNavigation;
