import React, { ReactNode, useState, useRef } from 'react';
import { Box, Pagination, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { LoadingBoundary, ErrorBoundary } from 'components';
import { log } from 'utils';
import { useChunkStore } from 'store';
import { Chunk } from 'features';

import { getChunksStyles } from './Chunks.style';

interface ChunksPaginationProps {
    pageCount: number;
    page: number;
    handleChange: (event: React.ChangeEvent<unknown>, value: number) => void;
    children?: ReactNode;
}

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

const Chunks = () => {
    const theme = useTheme();
    const styles = getChunksStyles(theme);

    const { chunks, loadingChunks, chunksError } = useChunkStore();

    const [page, setPage] = useState(1);


    // Pagination logic
    const chunksPerPage = 5;
    const pageCount = Math.ceil(chunks.length / chunksPerPage);
    const startIdx = (page - 1) * chunksPerPage;
    const endIdx = startIdx + chunksPerPage;
    const paginatedChunks = chunks.slice(startIdx, endIdx);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const prevChunksRef = useRef<any[]>([]);
    // Preserve scroll position on chunk updates
    React.useEffect(() => {
        prevChunksRef.current = chunks;
    }, [chunks]);
    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loadingChunks}>
                {chunksError ? (
                    <Box sx={styles.container} data-testid="chunks-container-error">
                        <Alert severity="error">{chunksError}</Alert>
                    </Box>
                ) : (
                    <Box
                        sx={styles.container}
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

export default Chunks;

