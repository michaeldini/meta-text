import React, { memo, useMemo } from 'react';
import { Box, Paper, Slide, useTheme } from '@mui/material';

import { useChunkStore } from 'store';

import ChunkWords from './components/ChunkWords';
import ChunkTabs from './components/ChunkTabs';
import { getChunkComponentsStyles } from './Chunk.styles';
import type { ChunkType } from 'types';

export interface ChunkProps {
    chunk: ChunkType;
    chunkIdx: number;
}

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
}: ChunkProps) {
    const { activeTabs, updateChunkField } = useChunkStore();
    const theme = useTheme();
    const styles = getChunkComponentsStyles(theme);

    return (
        <Box
            data-chunk-id={chunk.id}
            sx={styles.chunkContainer}
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
