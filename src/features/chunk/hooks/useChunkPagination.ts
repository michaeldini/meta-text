import { useEffect, useMemo, useState } from 'react';
import type { ChunkType } from '@mtypes/documents';
import { scrollToChunkDOM } from '@features/chunk/utils/scrollToChunk';

interface UseChunkPaginationOptions {
    initialPage?: number;
    initialChunksPerPage?: number;
}

export function useChunkPagination(
    chunks: ChunkType[] | undefined,
    { initialPage = 1, initialChunksPerPage = 5 }: UseChunkPaginationOptions = {}
) {
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [chunksPerPage, setChunksPerPage] = useState<number>(initialChunksPerPage);

    useEffect(() => {
        setChunksPerPage(initialChunksPerPage);
    }, [initialChunksPerPage]);

    useEffect(() => {
        // Reset page if chunks change
        setCurrentPage((p) => {
            if (!chunks || chunks.length === 0) return 1;
            const totalPages = Math.max(1, Math.ceil(chunks.length / chunksPerPage));
            return p > totalPages ? 1 : p;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chunks, chunksPerPage]);

    const totalFilteredChunks = chunks ? chunks.length : 0;
    const totalPages = Math.ceil(totalFilteredChunks / Math.max(1, chunksPerPage));
    const startIndex = (currentPage - 1) * chunksPerPage;
    const endIndex = startIndex + chunksPerPage;

    const displayChunks = useMemo(() => {
        if (!chunks || chunks.length === 0) return [];
        return chunks.slice(startIndex, endIndex);
    }, [chunks, startIndex, endIndex]);

    function goToChunkById(chunkId: number) {
        if (!chunks) {
            // just scroll
            requestAnimationFrame(() => scrollToChunkDOM(chunkId));
            return;
        }
        const idx = chunks.findIndex((c) => c.id === chunkId);
        if (idx >= 0) {
            const page = Math.floor(idx / chunksPerPage) + 1;
            setCurrentPage(page);
            // wait for render
            requestAnimationFrame(() => scrollToChunkDOM(chunkId));
            return;
        }
        requestAnimationFrame(() => scrollToChunkDOM(chunkId));
    }

    function scrollToChunk(chunkId: number) {
        requestAnimationFrame(() => scrollToChunkDOM(chunkId));
    }

    return {
        displayChunks,
        totalFilteredChunks,
        chunksPerPage,
        setChunksPerPage,
        currentPage,
        totalPages,
        setCurrentPage,
        startIndex,
        endIndex,
        goToChunkById,
        scrollToChunk,
    };
}
