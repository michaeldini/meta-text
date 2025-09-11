import React from 'react';
import { Box, Stack } from '@styles';
import { ChunkStatusInfo } from './ChunkStatusInfo';
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
    isSearching?: boolean;
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
    isSearching = false,
}: ChunkDisplayContainerProps) {
    return (
        <Box data-testid="chunk-display-container">
            <Stack css={{ gap: 10 }}>
                <ChunkStatusInfo
                    totalFilteredChunks={totalFilteredChunks}
                    displayChunksCount={displayChunks.length}
                    isSearching={isSearching}
                />

                <ChunkPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalFilteredChunks}
                    pageSize={chunksPerPage}
                    onPageChange={onPageChange}
                />

                <ChunkList chunks={displayChunks} startIndex={startIndex} />
            </Stack>
        </Box>
    );
}
