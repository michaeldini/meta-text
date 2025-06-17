import React, { memo } from 'react';
import { Box, Paper } from '@mui/material';
import ChunkWords from './ChunkWords';
import ChunkTools from './ChunkTools';
import { chunkMainBox, chunkTextBox, chunkDetailsCol } from './Chunks.styles';

export interface ChunkProps {
    chunk: any;
    chunkIdx: number;
    handleWordClick: (chunkIdx: number, wordIdx: number) => void;
    handleRemoveChunk: (chunkIdx: number) => void;
    handleChunkFieldChange: (chunkIdx: number, field: string, value: any) => void;
}

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
    handleWordClick,
    handleRemoveChunk,
    handleChunkFieldChange
}: ChunkProps) {
    const words = chunk.content ? chunk.content.split(/\s+/) : [];
    return (
        <Paper elevation={3} sx={chunkMainBox}>
            <Box sx={chunkTextBox}>
                <ChunkWords
                    words={words}
                    chunkIdx={chunkIdx}
                    handleWordClick={handleWordClick}
                    handleRemoveChunk={handleRemoveChunk}
                    chunk={chunk}
                />
            </Box>
            <Box sx={chunkDetailsCol}>
                <ChunkTools
                    chunk={chunk}
                    chunkIdx={chunkIdx}
                    handleChunkFieldChange={handleChunkFieldChange}
                />
            </Box>
        </Paper>
    );
});

export default Chunk;
