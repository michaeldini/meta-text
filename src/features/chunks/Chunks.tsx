import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Pagination, Paper, Alert, Slide } from '@mui/material';
import { LoadingBoundary, ErrorBoundary } from 'components';
import log from '../../utils/logger';
import { useChunkStore } from 'store';

import Chunk from '../chunk/components/Chunk';
import { getChunksStyles } from './Chunks.style';
import { useTheme } from '@mui/material/styles';

interface ChunksPaginationProps {
    pageCount: number;
    page: number;
    handleChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

function ChunksPagination({ pageCount, page, handleChange }: ChunksPaginationProps) {
    if (pageCount <= 1) return null;
    return (
        <Box>
            <Pagination count={pageCount} page={page} onChange={handleChange} color="secondary" />
        </Box>
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

    // Keyboard navigation with j/k and scroll into view
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        // Prevent shortcuts when typing in input, textarea, or contenteditable
        const target = e.target as HTMLElement;
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        ) {
            return;
        }
        if (!paginatedChunks.length) return;
        const currentIdx = paginatedChunks.findIndex(chunk => chunk.id === activeChunkId);
        let newChunkId: number | null = null;
        if (e.key === 'j' || e.key === 'ArrowDown') {
            const nextIdx = Math.min(currentIdx + 1, paginatedChunks.length - 1);
            if (nextIdx !== currentIdx && paginatedChunks[nextIdx]) {
                newChunkId = paginatedChunks[nextIdx].id;
                setActiveChunk(newChunkId);
            }
            e.preventDefault();
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
            const prevIdx = Math.max(currentIdx - 1, 0);
            if (prevIdx !== currentIdx && paginatedChunks[prevIdx]) {
                newChunkId = paginatedChunks[prevIdx].id;
                setActiveChunk(newChunkId);
            }
            e.preventDefault();
        }
        // Scroll to the new chunk if navigation occurred
        if (newChunkId !== null && containerRef.current) {
            setTimeout(() => {
                const chunkNode = containerRef.current?.querySelector(
                    `[data-chunk-id="${newChunkId}"]`
                );
                if (chunkNode && chunkNode.scrollIntoView) {
                    chunkNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 0);
        }
    }, [paginatedChunks, activeChunkId, setActiveChunk]);

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
