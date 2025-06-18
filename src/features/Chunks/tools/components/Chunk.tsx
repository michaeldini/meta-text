import React, { memo, useRef, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import ChunkWords from '../../words/ChunkWords';
import ChunkToolsDisplay from '../ChunkToolsDisplay';
import { chunkMainBox } from '../../styles/styles';
import { useChunkStore } from '../../../../store/chunkStore';

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
                handleWordClick={handleWordClick}
                handleRemoveChunk={handleRemoveChunk}
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
