import React, { useState } from 'react';
import { Box, Pagination } from '@mui/material';
import Chunk from './Chunk';
import { chunksContainer, chunksPaginationBox } from '../styles/pageStyles';

export default function Chunks({ chunks, handleWordClick, handleRemoveChunk, handleChunkFieldChange }) {
    // Defensive: always treat chunks as array
    const safeChunks = Array.isArray(chunks) ? chunks : [];
    const [page, setPage] = useState(1);
    const chunksPerPage = 5;
    const pageCount = Math.ceil(safeChunks.length / chunksPerPage);
    const startIdx = (page - 1) * chunksPerPage;
    const endIdx = startIdx + chunksPerPage;
    const paginatedChunks = safeChunks.slice(startIdx, endIdx);

    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <Box sx={chunksContainer}>
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
            {pageCount > 1 && (
                <Box sx={chunksPaginationBox}>
                    <Pagination count={pageCount} page={page} onChange={handleChange} color="primary" />
                </Box>
            )}
        </Box>
    );
}