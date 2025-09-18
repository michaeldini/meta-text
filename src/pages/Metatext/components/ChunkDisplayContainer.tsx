import React from 'react';
import { Box, Stack } from '@styles';
import { ChunkPagination } from './ChunkPagination';
import { ChunkList } from './ChunkList';
import type { ChunkType } from '@mtypes/documents';

interface ChunkDisplayContainerProps {
    displayChunks: ChunkType[];
    totalFilteredChunks: number;
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
    totalFilteredChunks,
    chunksPerPage = 5,
    currentPage,
    totalPages,
    onPageChange,
    startIndex,
}: ChunkDisplayContainerProps) {
    return (
        <Box data-testid="chunk-display-container">
            <Stack css={{ gap: 10 }}>
                <ChunkPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={chunksPerPage}
                    onPageChange={onPageChange}
                />

                <ChunkList chunks={displayChunks} startIndex={startIndex} />
            </Stack>
        </Box>
    );
}
