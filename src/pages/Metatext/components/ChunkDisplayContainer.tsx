import React from 'react';
import { Box, Column } from '@styles';
import { ChunkPagination } from './ChunkPagination';
import { ChunkList } from './ChunkList';
import type { ChunkType } from '@mtypes/documents';

interface ChunkDisplayContainerProps {
    displayChunks: ChunkType[];
    chunksPerPage?: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    startIndex: number;
}

/**
 * ChunkDisplayContainer - Combines status, pagination, and list rendering for chunks
 */
export function ChunkDisplayContainer({
    displayChunks,
    chunksPerPage = 5,
    currentPage,
    totalPages,
    onPageChange,
    startIndex,
}: ChunkDisplayContainerProps) {
    return (
        <Column data-testid="chunk-display-container" p="3">
            <ChunkPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={chunksPerPage}
                onPageChange={onPageChange}
            />

            <ChunkList chunks={displayChunks} startIndex={startIndex} />
        </Column>
    );
}
