// Custom hook to handle navigation to a bookmarked chunk
// Extracts the logic from PaginatedChunks to keep the component clean

import React from 'react';
import { useBookmarkUIStore } from './bookmarkStore';
import type { ChunkType } from 'types';

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
            const idx = chunks.findIndex((c) => c.id === bookmarkedChunkId);
            if (idx >= 0) {
                const page = Math.floor(idx / chunksPerPage) + 1;
                setPage(page);
                setTimeout(() => {
                    const el = document.querySelector(`[data-chunk-id="${bookmarkedChunkId}"]`);
                    if (el) {
                        (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 0);
            }
            clearNavigateToBookmark();
        }
    }, [navigateToBookmark, bookmarkedChunkId, chunks, chunksPerPage, setPage, clearNavigateToBookmark]);
};

export default useChunkBookmarkNavigation;
