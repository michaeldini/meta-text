import React, { useState, useRef } from 'react';
import { Box, Pagination, Paper, Alert, Slide } from '@mui/material';
import Chunk from './components/Chunk';
import { createChunksContainerStyles } from './styles/theme-aware-styles';
import log from '../../utils/logger';
import LoadingBoundary from '../../components/LoadingBoundary';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useChunkStore } from '../../store/chunkStore';
import { useTheme } from '@mui/material/styles';

// Export the new organized structure
export * from './components';
export * from './tools';
export * from './layouts';

interface ChunksPaginationProps {
    pageCount: number;
    page: number;
    handleChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

function ChunksPagination({ pageCount, page, handleChange }: ChunksPaginationProps) {
    if (pageCount <= 1) return null;
    return (
        <Slide in={true} timeout={500} direction="up">
            <Paper elevation={5} sx={{ padding: 0 }}>
                <Pagination count={pageCount} page={page} onChange={handleChange} color="primary" />
            </Paper>
        </Slide>
    );
}

interface ChunksProps {
    metaTextId: string;
}

const Chunks: React.FC<ChunksProps> = ({ metaTextId }) => {
    const { chunks, loadingChunks, chunksError, fetchChunks, updateChunkField, resetChunkState } = useChunkStore();
    const [page, setPage] = useState(1);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const prevChunksRef = useRef<any[]>([]);

    // Preserve scroll position on chunk updates
    React.useEffect(() => {
        prevChunksRef.current = chunks;
    }, [chunks]);

    React.useEffect(() => {
        if (metaTextId) {
            // Reset chunk state when navigating to a different MetaText
            resetChunkState();
            fetchChunks(Number(metaTextId));
        }
    }, [metaTextId, fetchChunks, resetChunkState]);

    if (!Array.isArray(chunks)) {
        log.error('Chunks prop is not an array:', chunks);
        throw new Error('Chunks prop must be an array. Received: ' + typeof chunks);
    }
    const chunksPerPage = 5;
    const pageCount = Math.ceil(chunks.length / chunksPerPage);
    const startIdx = (page - 1) * chunksPerPage;
    const endIdx = startIdx + chunksPerPage;
    const paginatedChunks = chunks.slice(startIdx, endIdx);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // Replace hard-coded styles with theme-aware styles
    const theme = useTheme();
    const chunksContainer = createChunksContainerStyles(theme);

    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loadingChunks}>
                {chunksError ? (
                    <Box sx={chunksContainer} data-testid="chunks-container-error">
                        <Alert severity="error">{chunksError}</Alert>
                    </Box>
                ) : (
                    <Box ref={containerRef} sx={chunksContainer} data-testid="chunks-container">
                        <ChunksPagination pageCount={pageCount} page={page} handleChange={handleChange} />
                        {paginatedChunks.map((chunk, chunkIdx) => (
                            <Chunk
                                key={startIdx + chunkIdx}
                                chunk={chunk}
                                chunkIdx={startIdx + chunkIdx}
                                handleChunkFieldChange={updateChunkField}
                            />
                        ))}
                        <ChunksPagination pageCount={pageCount} page={page} handleChange={handleChange} />
                    </Box>
                )}
            </LoadingBoundary>
        </ErrorBoundary>
    );
};

export default Chunks;
