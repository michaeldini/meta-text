// A component to display paginated chunks of a meta text
// It handles loading states, errors, and pagination of chunks

import React, { ReactNode, useState, useRef } from 'react';
import { Box, Pagination } from '@mui/material';
import useChunkBookmarkNavigation from '../chunk-bookmark/useChunkBookmarkNavigation';
import { useTheme } from '@mui/material/styles';

import { LoadingBoundary, ErrorBoundary, AppAlert } from 'components';
import { log } from 'utils';
import { useChunkStore } from 'store';
import { Chunk } from 'features';
import { usePaginationStore } from '../chunk-search/store/usePaginationStore';
import { useSearchStore } from '../chunk-search/store/useSearchStore';

import { getChunkComponentsStyles } from './Chunk.styles';

// handleChange: Function to handle when user changes the page
// This is typically called when the user clicks on a pagination button
// or changes the page number in the pagination component
// Children: Optional children to render alongside the pagination
// The children will be a mapping of the chunks to be displayed
interface ChunksPaginationProps {
    pageCount: number;
    page: number;
    handleChange: (event: React.ChangeEvent<unknown>, value: number) => void;
    children?: ReactNode;
}

interface PaginationProps {
    metatextId: number;
}


// component to handle pagination of chunks with two pagination controls and the children chunks
function ChunksPagination({ pageCount, page, handleChange, children }: ChunksPaginationProps) {
    if (pageCount <= 1) return <>{children}</>;
    return (
        <>
            <Pagination count={pageCount} page={page} onChange={handleChange} color="secondary" />
            {children}
            <Pagination count={pageCount} page={page} onChange={handleChange} color="secondary" />
        </>
    );
}


// Main component to display paginated chunks
const PaginatedChunks = ({ metatextId }: PaginationProps) => {
    const theme = useTheme();
    const styles = getChunkComponentsStyles(theme);

    const { chunks, loadingChunks, chunksError, fetchChunks, resetChunkState } = useChunkStore();
    const { filteredChunks, isInSearchMode } = useSearchStore();

    // Use filtered chunks when in search mode, otherwise use original chunks
    const displayChunks = isInSearchMode ? filteredChunks : chunks;

    // Use pagination store for shared state
    const { currentPage, setCurrentPage, setChunksPerPage } = usePaginationStore();

    // Fetch chunks when metatextId changes
    React.useEffect(() => {
        if (metatextId) {
            fetchChunks(Number(metatextId));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metatextId]);

    // Pagination logic
    const chunksPerPage = 5;

    // Update store when chunks per page changes
    React.useEffect(() => {
        setChunksPerPage(chunksPerPage);
    }, [setChunksPerPage]);

    const pageCount = Math.ceil(displayChunks.length / chunksPerPage);
    const startIdx = (currentPage - 1) * chunksPerPage;
    const endIdx = startIdx + chunksPerPage;
    const paginatedChunks = displayChunks.slice(startIdx, endIdx);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    // Wrapper for bookmark navigation to handle the setCurrentPage signature
    const handlePageChange = React.useCallback((page: React.SetStateAction<number>) => {
        if (typeof page === 'function') {
            setCurrentPage(page(currentPage));
        } else {
            setCurrentPage(page);
        }
    }, [currentPage, setCurrentPage]);

    // Handle navigation to bookmarked chunk using custom hook
    useChunkBookmarkNavigation(displayChunks, chunksPerPage, handlePageChange);

    // I dont know why this is needed, but it preserves the previous chunks
    // when the chunks are updated
    const prevChunksRef = useRef<any[]>([]);
    // Preserve scroll position on chunk updates
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
                    <Box
                        sx={styles.chunksContainer}
                        data-testid="chunks-container"
                    >
                        <ChunksPagination pageCount={pageCount} page={currentPage} handleChange={handleChange}>
                            {paginatedChunks.map((chunk, chunkIdx) => (
                                <Chunk
                                    key={chunk.id}
                                    chunk={chunk}
                                    chunkIdx={startIdx + chunkIdx}
                                />
                            ))}
                        </ChunksPagination>
                    </Box>
                )}
            </LoadingBoundary>
        </ErrorBoundary>
    );
};

export default PaginatedChunks;

