// Custom hook to handle navigation to a bookmarked chunk
// Extracts the logic from PaginatedChunks to keep the component clean

import React from 'react';
import { useBookmarkUIStore } from '../store/bookmarkStore';
import type { ChunkType } from 'types';
import { findChunkIndex, getChunkPage, scrollToChunk } from '../handlers/bookmarkHandlers';

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
