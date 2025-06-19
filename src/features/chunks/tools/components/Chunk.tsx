import React, { memo, useRef, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import ChunkWords from '../../words/ChunkWords';
import ChunkToolsDisplay from '../ChunkToolsDisplay';
import { chunkMainBox } from '../../styles/styles';
import { useChunkStore } from '../../../../store/chunkStore';
import type { Chunk } from '../../../../types/chunk';

export interface ChunkProps {
    chunk: Chunk;
    chunkIdx: number;
    handleChunkFieldChange: (chunkId: number, field: keyof Chunk, value: any) => void;
}

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
    handleChunkFieldChange
}: ChunkProps) {
    const words = chunk.text ? chunk.text.split(/\s+/) : [];
    const { activeChunkId, setActiveChunk } = useChunkStore();
    const isActive = activeChunkId === chunk.id;
    const chunkRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isActive && chunkRef.current) {
            const navbarHeight = 64; // Adjust if your AppBar is a different height
            const rect = chunkRef.current.getBoundingClientRect();
        }
    }, [isActive]);

    return (
        <Paper ref={chunkRef} elevation={isActive ? 6 : 3} sx={{ ...chunkMainBox, border: isActive ? '2px solid #1976d2' : '1px solid #ccc', cursor: 'pointer' }} onClick={() => setActiveChunk(chunk.id)}>
            <ChunkWords
                words={words}
                chunkIdx={chunkIdx}
                chunk={chunk}
            />
            <ChunkToolsDisplay
                chunk={chunk}
                chunkIdx={chunkIdx}
                handleChunkFieldChange={handleChunkFieldChange}
            />
        </Paper >
    );
});

export default Chunk;
