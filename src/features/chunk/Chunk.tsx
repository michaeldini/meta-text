import React, { memo, useMemo } from 'react';
import { Box, Paper, Slide, useTheme } from '@mui/material';

import { useChunkStore } from 'store';

import ChunkWords from './components/ChunkWords';
import ChunkTabs from './components/ChunkTabs';
import { getChunkStyles } from './Chunk.styles';
import type { ChunkType } from 'types';

export interface ChunkProps {
    chunk: ChunkType;
    chunkIdx: number;
}

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
}: ChunkProps) {
    const { activeChunkId, setActiveChunk, activeTabs, updateChunkField } = useChunkStore();
    const theme = useTheme();
    const styles = getChunkStyles(theme);

    return (
        <Box
            data-chunk-id={chunk.id}
            sx={styles.chunkContainer}
            onClick={() => setActiveChunk(chunk.id)}
        >
            <ChunkWords
                chunk={chunk}
                chunkIdx={chunkIdx}
            />
            <ChunkTabs
                chunk={chunk}
                activeTabs={activeTabs}
                updateChunkField={updateChunkField}
            />
        </Box>
    );
});

export default Chunk;
