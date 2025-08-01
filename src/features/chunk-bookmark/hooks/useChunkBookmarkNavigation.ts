// Custom hook to handle navigation to a bookmarked chunk
// Extracts the logic from PaginatedChunks to keep the component clean

import React from 'react';
import { useBookmarkUIStore } from '../store/bookmarkStore';
import type { ChunkType } from '@mtypes/documents';
import { findChunkIndex, getChunkPage, scrollToChunk } from '../handlers/bookmarkHandlers';

const useChunkBookmarkNavigation = (
    chunks: ChunkType[],
    chunksPerPage: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    bookmarkedChunkId: number | null
) => {

    // get the navigation trigger and the function to clear the navigation to a chunk
    const { navigateToBookmark, clearNavigateToBookmark } = useBookmarkUIStore();

    React.useEffect(() => {

        // if the trigger is set and there is a bookmarked chunk
        if (navigateToBookmark && bookmarkedChunkId != null) {

            // find the index (where it is on the page) of the chunk.
            const idx = findChunkIndex(chunks, bookmarkedChunkId);
            if (idx >= 0) {
                // get the page where this chunk exists
                const page = getChunkPage(idx, chunksPerPage);
                // go to the page
                setPage(page);
                // go to the chunk
                setTimeout(() => {
                    scrollToChunk(bookmarkedChunkId);
                }, 0);
            }

            // stop the navigation
            clearNavigateToBookmark();
        }
    }, [navigateToBookmark, bookmarkedChunkId, chunks, chunksPerPage, setPage, clearNavigateToBookmark]);
};

export default useChunkBookmarkNavigation;
