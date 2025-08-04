import React, { memo, useMemo } from 'react';
import { Box, Stack } from '@chakra-ui/react';

import { useChunkStore } from '@store/chunkStore';

import ChunkWords from './components/ChunkWords';
import { ChunkToolsContainer } from '@features/chunk-tools';
import type { ChunkType } from '@mtypes/documents';

export interface ChunkProps {
    chunk: ChunkType;
    chunkIdx: number;
}

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
}: ChunkProps) {
    const { activeTabs, updateChunkField } = useChunkStore();


    return (
        <Stack direction="row"
            data-chunk-id={chunk.id}
            width="100%"
        >
            <ChunkWords
                chunk={chunk}
                chunkIdx={chunkIdx}
            />
            <ChunkToolsContainer
                chunk={chunk}
                activeTools={activeTabs}
                updateChunkField={updateChunkField}
            />
        </Stack>
    );
});

export default Chunk;
