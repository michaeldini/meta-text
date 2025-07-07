import React, { ReactNode, useState, useRef, useCallback } from 'react';
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
    const { chunks, loadingChunks, chunksError } = useChunkStore();
    const setActiveChunk = useChunkStore(state => state.setActiveChunk);
    const activeChunkId = useChunkStore(state => state.activeChunkId);

    const [page, setPage] = useState(1);

    // Refs for scroll position and chunk elements
    const containerRef = useRef<HTMLDivElement | null>(null);


    // const chunkRefs = useRef<(HTMLDivElement | null)[]>([]);
    // const prevChunksRef = useRef<any[]>([]);
    // // Preserve scroll position on chunk updates
    // React.useEffect(() => {
    //     prevChunksRef.current = chunks;
    // }, [chunks]);

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
                        <ChunksPagination pageCount={pageCount} page={page} handleChange={handleChange}>
                            {paginatedChunks.map((chunk, chunkIdx) => (
                                <Chunk
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
