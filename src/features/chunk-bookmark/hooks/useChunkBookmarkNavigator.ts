import React from 'react';
import type { ChunkType } from '@mtypes/documents';
import { scrollToChunkDOM } from '@features/chunk/utils/scrollToChunk';

function findChunkIndex(chunks: ChunkType[], chunkId: number): number {
    return chunks.findIndex((c) => c.id === chunkId);
}

function getChunkPage(idx: number, chunksPerPage: number): number {
    return Math.floor(idx / chunksPerPage) + 1;
}

/**
 * Hook that returns a navigator function to jump to a chunk by id.
 * Keeps page calculation and scrolling in one place so UI code is simpler.
 */
export function useChunkBookmarkNavigator() {
    const goToChunkById = React.useCallback(
        (
            chunkId: number,
            displayChunks?: ChunkType[],
            setCurrentPage?: (p: number) => void,
            chunksPerPage?: number
        ) => {
            if (displayChunks && setCurrentPage && typeof chunksPerPage === 'number') {
                const idx = findChunkIndex(displayChunks, chunkId);
                if (idx >= 0) {
                    const page = getChunkPage(idx, chunksPerPage);
                    setCurrentPage(page);
                    requestAnimationFrame(() => scrollToChunkDOM(chunkId));
                    return;
                }
            }
            // fallback
            requestAnimationFrame(() => scrollToChunkDOM(chunkId));
        },
        []
    );

    return { goToChunkById };
}
