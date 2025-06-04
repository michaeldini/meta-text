import React, { useState } from 'react';
import { Box, Pagination } from '@mui/material';
import Chunk from './Chunk';

export default function Chunks({ chunks, handleWordClick, handleRemoveSection, handleSectionFieldChange }) {
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
            {paginatedChunks.map((chunk, chunkIdx) => (
                <Chunk
                    key={startIdx + chunkIdx}
                    chunk={chunk}
                    chunkIdx={startIdx + chunkIdx}
                    handleWordClick={handleWordClick}
                    handleRemoveChunk={handleRemoveSection}
                    handleChunkFieldChange={handleSectionFieldChange}
                />
            ))}
            {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination count={pageCount} page={page} onChange={handleChange} color="primary" />
                </Box>
            )}
        </Box>
    );
}