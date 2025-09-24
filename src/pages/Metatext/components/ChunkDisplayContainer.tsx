/**
 * Displays chunks and pagination controls.
 * 
 * The chunks are paginated and displayed in a list format.
 * Pagination controls allow navigation through different pages of chunks.
 * 
 * Props:
 * - displayChunks: The chunks to be displayed on the current page.
 * - chunksPerPage: Number of chunks to display per page (default is 5).
 * - currentPage: Current page number.
 * - totalPages: Total number of pages based on filtered chunks and chunks per page.
 * - onPageChange: Function to set the current page.
 * - startIndex: The starting index for chunk numbering in the list.
 * 
 */

import React from 'react';
import { ChunkPagination } from './ChunkPagination';
import { ChunkList } from './ChunkList';
import type { ChunkType } from '@mtypes/documents';
import { Column } from '@styles';

interface ChunkDisplayContainerProps {
    /** The chunks to be displayed on the current page. */
    displayChunks: ChunkType[];
    /** Current page number. */
    currentPage: number;
    /** Total number of pages based on filtered chunks and chunks per page. */
    totalPages: number;
    /** Function to set the current page. */
    onPageChange: (page: number) => void;
}

/**
 * ChunkDisplayContainer - Combines pagination and list rendering for chunks
 */
export function ChunkDisplayContainer({
    displayChunks,
    currentPage,
    totalPages,
    onPageChange,
}: ChunkDisplayContainerProps) {
    return (
        <Column data-testid="chunk-display-container" p="3">
            <ChunkPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />

            <ChunkList chunks={displayChunks} />
        </Column>
    );
}
