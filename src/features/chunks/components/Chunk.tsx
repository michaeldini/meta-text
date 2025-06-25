import React, { memo, useRef, useEffect, useMemo } from 'react';
import { Box, Paper, Slide, useTheme } from '@mui/material';
import { ChunkWords } from '.';
import ChunkToolsDisplay from '../tools/ChunkToolsDisplay';
import { getChunkStyles } from './styles/Chunk.styles';
import { useChunkStore } from '../../../store/chunkStore';
import type { Chunk } from '../../../types/chunk';
import type { ChunkFieldValue } from '../../../store/chunkStore';

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
    const theme = useTheme();
    const styles = useMemo(() => getChunkStyles(theme), [theme]);

    useEffect(() => {
        if (isActive && chunkRef.current) {
            const navbarHeight = 64; // Adjust if your AppBar is a different height
            const rect = chunkRef.current.getBoundingClientRect();
        }
    }, [isActive]);

    return (
        <Paper
            ref={chunkRef}
            data-chunk-id={chunk.id}
            elevation={isActive ? 2 : 0}
            sx={styles.chunkContainer}
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
        </Paper>
    );
});

export default Chunk;
