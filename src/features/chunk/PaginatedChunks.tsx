// A component to display paginated chunks of a meta text
// It handles loading states, errors, and pagination of chunks using Chakra UI v3

import React from 'react';
import { Center } from '@chakra-ui/react/center';
import { Box } from '@chakra-ui/react/box';
import { Pagination } from '@chakra-ui/react/pagination';
import { ButtonGroup, IconButton } from '@chakra-ui/react/button';
import { Stack } from '@chakra-ui/react/stack';

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { AppAlert } from 'components';
import { Boundary } from 'components/Boundaries';
import { Chunk } from 'features';

import { usePaginatedChunks } from './hooks/usePaginatedChunks';

interface PaginationProps {
    metatextId: number;
    showOnlyFavorites?: boolean;
}

// Main component to display paginated chunks

const PaginatedChunks = ({ metatextId, showOnlyFavorites }: PaginationProps) => {
    const {
        paginatedChunks,
        displayChunks,
        loadingChunks,
        chunksError,
        currentPage,
        setCurrentPage,
        chunksPerPage,
        pageCount,
        startIdx,
        endIdx,
    } = usePaginatedChunks({ metatextId, showOnlyFavorites });

    return (
        <Boundary>
            {chunksError ? (
                <Box data-testid="chunks-container-error">
                    <AppAlert severity="error">{chunksError}</AppAlert>
                </Box>
            ) : (
                <Box data-testid="chunks-container">
                    <Stack gap={4}>
                        <Center>
                            <Pagination.Root
                                count={pageCount}
                                pageSize={chunksPerPage}
                                page={currentPage}
                                onPageChange={e => setCurrentPage(e.page)}
                            >
                                <ButtonGroup variant="ghost" color="fg" >
                                    <Pagination.PageText format='compact' />
                                    <Pagination.PrevTrigger asChild color="fg" >
                                        <IconButton aria-label="Previous page" >
                                            <HiChevronLeft />
                                        </IconButton>
                                    </Pagination.PrevTrigger>
                                    <Pagination.Items
                                        color="fg"
                                        render={({ value }) => (
                                            <IconButton
                                                key={value}
                                                variant={{ base: "ghost", _selected: "outline" }}
                                                onClick={() => setCurrentPage(value)}
                                            >
                                                {value}
                                            </IconButton>
                                        )}
                                    />
                                    <Pagination.NextTrigger asChild color="fg" >
                                        <IconButton aria-label="Next page">
                                            <HiChevronRight />
                                        </IconButton>
                                    </Pagination.NextTrigger>
                                </ButtonGroup>
                            </Pagination.Root>
                        </Center>
                        {paginatedChunks.map((chunk, chunkIdx) => (
                            <Chunk
                                key={chunk.id}
                                chunk={chunk}
                                chunkIdx={startIdx + chunkIdx}
                            />
                        ))}
                    </Stack>
                </Box>
            )}
        </Boundary>
    );
};

export default PaginatedChunks;

