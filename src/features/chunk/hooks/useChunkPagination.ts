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
 * Returned object
 * - displayChunks: ChunkType[]
 *   - The subset of chunks for the current page (empty if chunks is undefined/empty).
 * - totalFilteredChunks: number
 *   - The total number of chunks passed in.
 * - chunksPerPage: number
 *   - Current number of chunks per page.
 * - setChunksPerPage: (n: number) => void
 *   - Setter for chunksPerPage.
 * - currentPage: number
 *   - Current 1-based page index.
 * - totalPages: number
 *   - Total pages computed from totalFilteredChunks / chunksPerPage (min 1).
 * - setCurrentPage: (p: number) => void
 *   - Setter for currentPage.
 * - startIndex: number
 *   - The start index (inclusive) in the full chunks array for the current page.
 * - endIndex: number
 *   - The end index (exclusive) in the full chunks array for the current page.
 * - goToChunkById: (chunkId: number) => void
 *   - Finds the chunk in the full list, updates the current page to the page that contains the chunk,
 *     and then requests a frame to perform DOM scrolling to the chunk via scrollToChunkDOM.
 *   - If chunks is undefined or the id is not found, it still attempts to scroll by id.
 * - scrollToChunk: (chunkId: number) => void
 *   - Requests a DOM scroll to the chunk id without changing pagination state.
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
 *   const {
 *     displayChunks,
 *     currentPage,
 *     totalPages,
 *     setCurrentPage,
 *     chunksPerPage,
 *     setChunksPerPage,
 *     goToChunkById,
 *   } = useChunkPagination(chunks, 1, 10);
 *
 *   return (
 *     // render displayChunks and pagination controls here
 *   );
 * }
 *
 * Implementation details
 * - The hook is intentionally simple and focused on UI pagination + scroll coordination.
 * - For more advanced filtering/sorting, apply those transformations before passing the chunks array.
 */

import { useEffect, useMemo, useState } from 'react';
import type { ChunkType } from '@mtypes/documents';
import { scrollToChunkDOM } from '@features/chunk/utils/scrollToChunk';

export function useChunkPagination(
    chunks: ChunkType[] | undefined,
    initialPage: number = 1,
    initialChunksPerPage: number = 5
) {

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


    /**
     * Reset page if chunks change
     */
    useEffect(() => {
        // Reset page if chunks change
        setCurrentPage((p) => {

            /**
             * Reset to page 1 if current page is out of range
             */
            if (!chunks || chunks.length === 0) return 1;

            /**
             * Get total pages
             */
            const totalPages = Math.max(1, Math.ceil(chunks.length / chunksPerPage));

            /**
             * If current page exceeds total pages, reset to 1
             */
            return p > totalPages ? 1 : p;
        });

        /** Reset page if chunks or chunksPerPage change */
    }, [chunks, chunksPerPage]);

    /** Total number of filtered chunks */
    const totalFilteredChunks = chunks ? chunks.length : 0;

    /** Total number of pages */
    const totalPages = Math.ceil(totalFilteredChunks / Math.max(1, chunksPerPage));

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

    /**
     * Scroll to a specific chunk by its ID, updating the page if necessary.
     */
    function goToChunkById(chunkId: number) {
        if (!chunks) {
            // just scroll
            requestAnimationFrame(() => scrollToChunkDOM(chunkId));
            return;
        }
        /** Find the index of the chunk with the given ID */
        const idx = chunks.findIndex((c) => c.id === chunkId);
        if (idx >= 0) {

            /** Calculate the page that contains this chunk */
            const page = Math.floor(idx / chunksPerPage) + 1;

            /** Update the current page */
            setCurrentPage(page);

            /** wait for render*/
            requestAnimationFrame(() => scrollToChunkDOM(chunkId));
            return;
        }

        /** Scroll to a specific chunk by its ID without changing the page. */
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
    };
}
