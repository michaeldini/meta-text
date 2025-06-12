import React, { useState, useRef, useEffect } from 'react';
import { Box, Pagination } from '@mui/material';
import Chunk from './Chunk';
import { chunksContainer, chunksPaginationBox } from '../styles/pageStyles';

function ChunksPagination({ pageCount, page, handleChange }) {
    if (pageCount <= 1) return null;
    return (
        <Box sx={chunksPaginationBox}>
            <Pagination count={pageCount} page={page} onChange={handleChange} color="primary" />
        </Box>
    );
}

export default function Chunks({ chunks, handleWordClick, handleRemoveChunk, handleChunkFieldChange }) {
    // Defensive: always treat chunks as array
    const safeChunks = Array.isArray(chunks) ? chunks : [];
    const [page, setPage] = useState(1);
    const chunksPerPage = 5;
    const pageCount = Math.ceil(safeChunks.length / chunksPerPage);
    const startIdx = (page - 1) * chunksPerPage;
    const endIdx = startIdx + chunksPerPage;
    const paginatedChunks = safeChunks.slice(startIdx, endIdx);

    // Add ref for the container
    const containerRef = useRef(null);

    // Scroll to top of container when page changes
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [page]);

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