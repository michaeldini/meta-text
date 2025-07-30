// A component to display paginated chunks of a meta text
// It handles loading states, errors, and pagination of chunks using Chakra UI v3

import React, { ReactNode, useRef } from 'react';
import { Center } from '@chakra-ui/react/center';
import { Box } from '@chakra-ui/react/box';
import { Pagination } from '@chakra-ui/react/pagination';
import { ButtonGroup, IconButton } from '@chakra-ui/react/button';
import { Stack } from '@chakra-ui/react/stack';

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

import { useBookmark } from 'features';
import { LoadingBoundary, ErrorBoundary, AppAlert } from 'components';
import { useChunkStore } from 'store';
import { Chunk } from 'features';

import useChunkBookmarkNavigation from '../chunk-bookmark/hooks/useChunkBookmarkNavigation';
import { usePaginationStore } from '../chunk-search/store/usePaginationStore';
import { useSearchStore } from '../chunk-search/store/useSearchStore';

interface PaginationProps {
    metatextId: number;
    showOnlyFavorites?: boolean;
}

// Main component to display paginated chunks

const PaginatedChunks = ({ metatextId, showOnlyFavorites }: PaginationProps) => {
    const { chunks, loadingChunks, chunksError, fetchChunks } = useChunkStore();
    const { filteredChunks, isInSearchMode } = useSearchStore();
    const { currentPage, setCurrentPage, setChunksPerPage } = usePaginationStore();

    // Combine search and favorite filters
    let displayChunks = isInSearchMode ? filteredChunks : chunks;
    if (showOnlyFavorites) {
        displayChunks = displayChunks.filter(chunk => !!chunk.favorited_by_user_id);
    }

    // Fetch chunks when metatextId changes
    React.useEffect(() => {
        if (metatextId) {
            fetchChunks(Number(metatextId));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metatextId]);

    // Pagination logic
    const chunksPerPage = 5;
    React.useEffect(() => {
        setChunksPerPage(chunksPerPage);
    }, [setChunksPerPage]);

    const pageCount = displayChunks.length;
    const startIdx = (currentPage - 1) * chunksPerPage;
    const endIdx = startIdx + chunksPerPage;
    const paginatedChunks = displayChunks.slice(startIdx, endIdx);

    // Reset currentPage to 1 if the current page is out of bounds after filtering (e.g., toggling favorites/search)
    React.useEffect(() => {
        if (currentPage > Math.ceil(pageCount / chunksPerPage) && pageCount > 0) {
            setCurrentPage(1);
        }
    }, [displayChunks, pageCount, currentPage, setCurrentPage, chunksPerPage]);

    // Wrapper for bookmark navigation to handle the setCurrentPage signature
    const handlePageChange = React.useCallback((page: React.SetStateAction<number>) => {
        if (typeof page === 'function') {
            setCurrentPage(page(currentPage));
        } else {
            setCurrentPage(page);
        }
    }, [currentPage, setCurrentPage]);

    // Get the current bookmarked chunk from React Query
    const { data: bookmarkedChunkId } = useBookmark(metatextId);
    // Handle navigation to bookmarked chunk using custom hook
    useChunkBookmarkNavigation(displayChunks, chunksPerPage, handlePageChange, bookmarkedChunkId ?? null);

    // Preserve previous chunks for scroll position
    const prevChunksRef = useRef<any[]>([]);
    React.useEffect(() => {
        prevChunksRef.current = displayChunks;
    }, [displayChunks]);

    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loadingChunks}>
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
            </LoadingBoundary>
        </ErrorBoundary>
    );
};

export default PaginatedChunks;

