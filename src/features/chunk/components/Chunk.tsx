import React, { memo, useRef, useEffect, useMemo } from 'react';
import { Paper, Slide, useTheme } from '@mui/material';

import { useChunkStore } from 'store';

import ChunkWords from '../words/ChunkWords';
import ChunkToolsDisplay from '../../chunk/tabs/ChunkTabs';
import { getChunkStyles } from './styles/Chunk.styles';
import type { Chunk } from '../../../types/chunk';
import type { ChunkFieldValue } from '../../../store/chunkStore';

export interface ChunkProps {
    chunk: Chunk;
    chunkIdx: number;
    // handleChunkFieldChange: (chunkId: number, field: keyof Chunk, value: ChunkFieldValue) => void;
}

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
    // handleChunkFieldChange
}: ChunkProps) {
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
                chunk={chunk}
                chunkIdx={chunkIdx}
            />
            <ChunkToolsDisplay
                chunk={chunk}
            />
        </Paper>
    );
});

export default Chunk;
