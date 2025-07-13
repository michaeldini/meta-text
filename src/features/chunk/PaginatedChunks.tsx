// A component to display paginated chunks of a meta text
// It handles loading states, errors, and pagination of chunks


import React, { ReactNode, useState, useRef } from 'react';
import { Box, Pagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { LoadingBoundary, ErrorBoundary, AppAlert } from 'components';
import { log } from 'utils';
import { useChunkStore } from 'store';
import { Chunk } from 'features';

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

    const [page, setPage] = useState(1);

    // Fetch chunks when metatextId changes
    React.useEffect(() => {
        if (metatextId) {
            fetchChunks(Number(metatextId));
        }
        return () => {
            resetChunkState();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metatextId]);

    // Pagination logic
    const chunksPerPage = 5;
    const pageCount = Math.ceil(chunks.length / chunksPerPage);
    const startIdx = (page - 1) * chunksPerPage;
    const endIdx = startIdx + chunksPerPage;
    const paginatedChunks = chunks.slice(startIdx, endIdx);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // I dont know why this is needed, but it preserves the previous chunks
    // when the chunks are updated
    const prevChunksRef = useRef<any[]>([]);
    // Preserve scroll position on chunk updates
    React.useEffect(() => {
        prevChunksRef.current = chunks;
    }, [chunks]);

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
                        tabIndex={0}
                    >
                        <ChunksPagination pageCount={pageCount} page={page} handleChange={handleChange}>
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

