import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Pagination, Paper, Alert, Slide } from '@mui/material';
import Chunk from './components/Chunk';
import { getChunksStyles } from './styles/Chunks.style';
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
            <Pagination count={pageCount} page={page} onChange={handleChange} color="secondary" />
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
    const setActiveChunk = useChunkStore(state => state.setActiveChunk);
    const activeChunkId = useChunkStore(state => state.activeChunkId);
    const chunkRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    const styles = getChunksStyles(theme);

    // Keyboard navigation with j/k
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!paginatedChunks.length) return;
        const currentIdx = paginatedChunks.findIndex(chunk => chunk.id === activeChunkId);
        if (e.key === 'j' || e.key === 'ArrowDown') {
            const nextIdx = Math.min(currentIdx + 1, paginatedChunks.length - 1);
            if (nextIdx !== currentIdx && paginatedChunks[nextIdx]) {
                setActiveChunk(paginatedChunks[nextIdx].id);
            }
            e.preventDefault();
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
            const prevIdx = Math.max(currentIdx - 1, 0);
            if (prevIdx !== currentIdx && paginatedChunks[prevIdx]) {
                setActiveChunk(paginatedChunks[prevIdx].id);
            }
            e.preventDefault();
        }
    }, [paginatedChunks, activeChunkId, setActiveChunk]);

    // Ensure the container is focused so it receives keyboard events
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, [paginatedChunks.length, page]);

    // Scroll to chunk when activeChunkId changes (keyboard navigation)
    useEffect(() => {
        if (!containerRef.current) return;
        if (!activeChunkId) return;
        setTimeout(() => {
            const chunkNode = containerRef.current?.querySelector(
                `[data-chunk-id="${activeChunkId}"]`
            );
            if (chunkNode && chunkNode.scrollIntoView) {
                chunkNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 0);
    }, [activeChunkId, paginatedChunks]);

    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loadingChunks}>
                {chunksError ? (
                    <Box sx={styles.container} data-testid="chunks-container-error">
                        <Alert severity="error">{chunksError}</Alert>
                    </Box>
                ) : (
                    <Box
                        ref={containerRef}
                        sx={styles.container}
                        data-testid="chunks-container"
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                    >
                        <ChunksPagination pageCount={pageCount} page={page} handleChange={handleChange} />
                        {paginatedChunks.map((chunk, chunkIdx) => (
                            <Box
                                component="div"
                                key={startIdx + chunkIdx}
                                ref={el => { chunkRefs.current[chunkIdx] = el as HTMLDivElement; }}
                                data-chunk-id={chunk.id}
                                data-chunk-idx={chunkIdx}
                                sx={{ height: '100%', width: '100%' }}
                            >
                                <Chunk
                                    chunk={chunk}
                                    chunkIdx={startIdx + chunkIdx}
                                    handleChunkFieldChange={updateChunkField}
                                    data-chunk-id={chunk.id}
                                />
                            </Box>
                        ))}
                        <ChunksPagination pageCount={pageCount} page={page} handleChange={handleChange} />
                    </Box>
                )}
            </LoadingBoundary>
        </ErrorBoundary>
    );
};

export default Chunks;
