/**
 * Displays chunks and pagination controls.
 * 
 * The chunks are paginated and displayed in a list format.
 * Pagination controls allow navigation through different pages of chunks.
 * 
 * Props:
 * - pager: The pager abstraction returned from useChunkPagination (or compatible shape).
 * 
 */

import React from 'react';
import { PaginationControls } from './PaginationControls';
import { ChunkList } from './ChunkList';
import type { ChunkType } from '@mtypes/documents';
import { Column } from '@styles';

// Minimal pager interface needed by this component (compatible with useChunkPagination)
interface PagerLike {
    displayChunks: ChunkType[];
    currentPage: number;
    pageNumbers: number[];
    gotoPage: (page: number) => void;
    hasPrev: boolean;
    hasNext: boolean;
}

interface ChunkDisplayContainerProps {
    /** Pager abstraction containing pagination state and actions */
    pager: PagerLike;
}

/**
 * ChunkDisplayContainer - Combines pagination and list rendering for chunks
 */
export function ChunkDisplayContainer({ pager }: ChunkDisplayContainerProps) {
    return (
        <Column data-testid="chunk-display-container" p="3">
            <PaginationControls
                currentPage={pager.currentPage}
                pageNumbers={pager.pageNumbers}
                onPageChange={pager.gotoPage}
                hasPrev={pager.hasPrev}
                hasNext={pager.hasNext}
            />

            <ChunkList chunks={pager.displayChunks} />
        </Column>
    );
}
