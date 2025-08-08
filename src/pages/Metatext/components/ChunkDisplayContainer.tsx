import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Stack } from '@chakra-ui/react/stack';
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
    isSearchActive?: boolean;
}

/**
 * ChunkDisplayContainer - Combines status, pagination, and list rendering for chunks
 */
export const ChunkDisplayContainer: React.FC<ChunkDisplayContainerProps> = ({
    displayChunks,
    totalFilteredChunks,
    chunksPerPage = 5,
    currentPage,
    totalPages,
    onPageChange,
    startIndex,
    isSearchActive = false,
}) => {
    return (
        <Box data-testid="chunk-display-container">
            <Stack gap={4}>
                <ChunkStatusInfo
                    totalFilteredChunks={totalFilteredChunks}
                    displayChunksCount={displayChunks.length}
                    isSearchActive={isSearchActive}
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
};
