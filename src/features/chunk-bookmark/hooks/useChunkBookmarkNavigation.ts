// Custom hook to handle navigation to a bookmarked chunk
// Extracts the logic from PaginatedChunks to keep the component clean

import React from 'react';
import { useBookmarkUIStore } from '../store/bookmarkStore';
import type { ChunkType } from '@mtypes/documents';
import { findChunkIndex, getChunkPage, scrollToChunk } from '../handlers/bookmarkHandlers';
import { useBookmark } from '@hooks/useBookmark';

const useChunkBookmarkNavigation = (
    metatextId: number,
    chunks: ChunkType[],
    chunksPerPage: number,
    setPage: (page: number) => void
) => {
    // Use the new useBookmark hook for bookmark state
    console.log('NAVIGATION metatextId', metatextId);
    const { bookmarkedChunkId } = useBookmark(metatextId);
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
