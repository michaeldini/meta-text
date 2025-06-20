import React, { memo, useRef, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { ChunkWords } from '../../components';
import ChunkToolsDisplay from '../ChunkToolsDisplay';
import { chunkMainBox } from '../../styles/styles';
import { useChunkStore } from '../../../../store/chunkStore';
import type { Chunk } from '../../../../types/chunk';
import type { ChunkFieldValue } from '../../../../store/chunkStore';

export interface ChunkProps {
    chunk: Chunk;
    chunkIdx: number;
    handleChunkFieldChange: (chunkId: number, field: keyof Chunk, value: ChunkFieldValue) => void;
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
        <Paper
            ref={chunkRef}
            elevation={isActive ? 2 : 0}
            sx={{
                ...chunkMainBox,
                border: isActive ? '1px solid #1976d2' : '1px solid #e0e0e0',
                cursor: 'pointer',
                backgroundColor: 'background.default',
                boxShadow: isActive ? '0 2px 8px rgba(25,118,210,0.1)' : 'none',
            }}
            onClick={() => setActiveChunk(chunk.id)}
        >
            <ChunkWords
                words={words}
                chunkIdx={chunkIdx}
                chunk={chunk}
            />
            <ChunkToolsDisplay
                chunk={chunk}
            />
        </Paper >
    );
});

export default Chunk;
