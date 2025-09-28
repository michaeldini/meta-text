/**
 * useChunkPagination
 *
 * A reusable React hook that provides pagination and controlled scrolling for a list of "chunks".
 *
 * Purpose
 * - Manage pagination state (current page, items per page) for a list of ChunkType items.
 * - Compute the slice of chunks to display for the current page.
 * - Provide helpers to navigate to a particular chunk by id and to request a DOM scroll to a chunk.
 * - Keep behavior deterministic when the chunks array changes (resets page when necessary).
 *
 * API
 * - useChunkPagination(chunks?, initialPage?, initialChunksPerPage?)
 *
 * Parameters
 * - chunks: ChunkType[] | undefined
 *   - The full list of chunks to paginate through. The hook handles `undefined` and empty arrays.
 * - initialPage?: number
 *   - Initial current page (1-based). Defaults to 1.
 * - initialChunksPerPage?: number
 *   - Initial number of chunks per page. Defaults to 5.
 *
 * Behavior & Notes
 * - Pages are 1-based.
 * - If the chunks array changes in length such that the current page is out of range, the hook resets
 *   the page to 1 to avoid landing on a non-existent page.
 * - Uses requestAnimationFrame to defer DOM scrolling until after React renders the page change.
 * - Safe with undefined chunks: displayChunks will be empty and helpers still attempt to scroll.
 *
 * Example
 * import { useChunkPagination } from './useChunkPagination';
 *
 * function ChunkList({ chunks }: { chunks: ChunkType[] }) {
 *   const pager = useChunkPagination(chunks, 1, 10);
 * 
 * Implementation details
 * - The hook is intentionally simple and focused on UI pagination + scroll coordination.
 * - For more advanced filtering/sorting, apply those transformations before passing the chunks array.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChunkType } from '@mtypes/documents';
import { scrollToChunkDOM } from '@features/chunk/utils/scrollToChunk';

interface UseChunkPaginationResult {
    /** The chunks to be displayed for the current page. */
    displayChunks: ChunkType[];
    /** Total number of filtered chunks */
    totalFilteredChunks: number;
    /** Number of chunks per page. */
    chunksPerPage: number;
    /** Set the number of chunks per page. */
    setChunksPerPage: (n: number) => void;
    /** Current page number (1-based). */
    currentPage: number;
    /** Total number of pages. */
    totalPages: number;
    /** Set the current page number (1-based). */
    setCurrentPage: (page: number) => void;
    /** Safe clamped setter for current page (1..totalPages). */
    setCurrentPageSafe: (page: number) => void;
    /** The index of the first chunk on the current page (0-based). */
    startIndex: number;
    /** The index of the last chunk on the current page (0-based). */
    endIndex: number;
    /** Navigate to a specific chunk by its ID, updating the page if necessary. */
    goToChunkById: (chunkId: number) => void;
    /** Whether there is a previous page available. */
    hasPrev: boolean;
    /** Whether there is a next page available. */
    hasNext: boolean;
    /** Alias for a safe clamped page jump (1-based). */
    gotoPage: (page: number) => void;
    /** Scroll to a specific chunk by its ID without changing the page. */
    // scrollToChunk: (chunkId: number) => void; --- IGNORE ---
}

/**
 * Custom hook to manage pagination of chunks with automatic page adjustment
 * when navigating to a specific chunk by ID.
 *
 * @param chunks - The full list of chunks to paginate through.
 * @param initialPage - Initial current page (1-based). Defaults to 1.
 * @param initialChunksPerPage - Initial number of chunks per page. Defaults to 5.
 * @returns An object containing pagination state and helper functions.
 */

export function useChunkPagination(
    chunks: ChunkType[] | undefined,
    initialPage: number = 1,
    initialChunksPerPage: number = 5
): UseChunkPaginationResult {

    /**
     * State for the current page number (1-based).
     */
    const [currentPage, setCurrentPage] = useState<number>(initialPage);

    /** State for the number of chunks per page. */
    const [chunksPerPage, setChunksPerPage] = useState<number>(initialChunksPerPage);

    /**
     * Ensure chunksPerPage is updated if initialChunksPerPage changes.
     */
    useEffect(() => {
        setChunksPerPage(initialChunksPerPage);
    }, [initialChunksPerPage]);


    // Clamp current page to valid range whenever chunks or page size change
    useEffect(() => {
        setCurrentPage((p) => {
            if (!chunks || chunks.length === 0) return 1;
            const total = Math.max(1, Math.ceil(chunks.length / Math.max(1, chunksPerPage)));
            return Math.min(Math.max(1, p), total);
        });
    }, [chunks, chunksPerPage]);
    /** Total number of filtered chunks */
    const totalFilteredChunks = chunks ? chunks.length : 0;

    /** Total number of pages (minimum 1 for UI sanity) */
    const totalPages = Math.max(1, Math.ceil(totalFilteredChunks / Math.max(1, chunksPerPage)));

    /** The start index (inclusive) in the full chunks array for the current page. */
    const startIndex = (currentPage - 1) * chunksPerPage;

    /** The end index (exclusive) in the full chunks array for the current page. */
    const endIndex = startIndex + chunksPerPage;

    /** The chunks to display for the current page. */
    const displayChunks = useMemo(() => {

        /** Return an empty array if no chunks */
        if (!chunks || chunks.length === 0) return [];

        /** Slice the chunks for the current page */
        return chunks.slice(startIndex, endIndex);

        /** Recompute when chunks, startIndex, or endIndex change */
    }, [chunks, startIndex, endIndex]);

    /** Safe clamped setter */
    const setCurrentPageSafe = useCallback((page: number) => {
        const clamped = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(clamped);
    }, [totalPages]);

    /** Derived navigation flags */
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;

    /**
     * Scroll to a specific chunk by its ID, updating the page if necessary.
     */
    const goToChunkById = useCallback((chunkId: number) => {
        if (!chunks || chunks.length === 0) {
            // just scroll
            requestAnimationFrame(() => scrollToChunkDOM(chunkId));
            return;
        }
        /** Find the index of the chunk with the given ID */
        const idx = chunks.findIndex((c) => c.id === chunkId);
        if (idx >= 0) {

            /** Calculate the page that contains this chunk */
            const page = Math.floor(idx / Math.max(1, chunksPerPage)) + 1;

            /** Update the current page */
            setCurrentPage(page);

            /** wait for render*/
            requestAnimationFrame(() => scrollToChunkDOM(chunkId));
            return;
        }

        /** Scroll to a specific chunk by its ID without changing the page. */
        requestAnimationFrame(() => scrollToChunkDOM(chunkId));
    }, [chunks, chunksPerPage]);
    return {
        displayChunks,
        totalFilteredChunks,
        chunksPerPage,
        setChunksPerPage,
        currentPage,
        totalPages,
        setCurrentPage,
        setCurrentPageSafe,
        startIndex,
        endIndex,
        goToChunkById,
        hasPrev,
        hasNext,
        gotoPage: setCurrentPageSafe,
    };
}
