import React, { memo } from 'react';
import { Box, Paper } from '@mui/material';
import ChunkWords from './words/ChunkWords';
import ChunkTools from './tools/ChunkTools';
import { chunkMainBox, chunkTextBox, chunkDetailsCol } from './styles/Chunks.styles';
import { useChunkStore } from '../../store/chunkStore';

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
    const { activeChunkId, setActiveChunk } = useChunkStore();
    const isActive = activeChunkId === chunk.id;
    return (
        <Paper elevation={isActive ? 6 : 3} sx={{ ...chunkMainBox, border: isActive ? '2px solid #1976d2' : '1px solid #ccc', cursor: 'pointer' }} onClick={() => setActiveChunk(chunk.id)}>
            <ChunkWords
                words={words}
                chunkIdx={chunkIdx}
                handleWordClick={handleWordClick}
                handleRemoveChunk={handleRemoveChunk}
                chunk={chunk}
            />
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
