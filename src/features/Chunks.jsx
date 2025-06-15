import React, { useState, useRef, useEffect } from 'react';
import { Box, Pagination, Paper, CircularProgress, Alert } from '@mui/material';
import Chunk from './Chunk';
import { chunksContainer } from '../styles/pageStyles';
import log from '../utils/logger';
import { useChunkHandlers } from '../hooks/useChunkHandlers';

function ChunksPagination({ pageCount, page, handleChange }) {
    if (pageCount <= 1) return null;
    return (
        <Paper elevation={5} >
            <Pagination count={pageCount} page={page} onChange={handleChange} color="primary" />
        </Paper>
    );
}

export default function Chunks({ metaTextId }) {
    console.log('Chunks render, metaTextId:', metaTextId);
    // All hooks must be called at the top, before any return
    const {
        chunks,
        loadingChunks,
        chunksError,
        handleWordClick,
        handleRemoveChunk,
        handleChunkFieldChange,
    } = useChunkHandlers(metaTextId);
    const [page, setPage] = useState(1);
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [page]);

    // Conditional rendering only after all hooks
    if (loadingChunks) {
        return (
            <Box sx={chunksContainer} data-testid="chunks-container-loading">
                <CircularProgress />
            </Box>
        );
    }
    if (chunksError) {
        return (
            <Box sx={chunksContainer} data-testid="chunks-container-error">
                <Alert severity="error">{chunksError}</Alert>
            </Box>
        );
    }
    if (!Array.isArray(chunks)) {
        log.error('Chunks prop is not an array:', chunks);
        throw new Error('Chunks prop must be an array. Received: ' + typeof chunks);
    }
    const chunksPerPage = 5;
    const pageCount = Math.ceil(chunks.length / chunksPerPage);
    const startIdx = (page - 1) * chunksPerPage;
    const endIdx = startIdx + chunksPerPage;
    const paginatedChunks = chunks.slice(startIdx, endIdx);

    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <Box ref={containerRef} sx={chunksContainer} data-testid="chunks-container">
            <ChunksPagination pageCount={pageCount} page={page} handleChange={handleChange} />
            {paginatedChunks.map((chunk, chunkIdx) => (
                <Chunk
                    key={startIdx + chunkIdx}
                    chunk={chunk}
                    chunkIdx={startIdx + chunkIdx}
                    handleWordClick={handleWordClick}
                    handleRemoveChunk={handleRemoveChunk}
                    handleChunkFieldChange={handleChunkFieldChange}
                />
            ))}
            <ChunksPagination pageCount={pageCount} page={page} handleChange={handleChange} />
        </Box>
    );
}