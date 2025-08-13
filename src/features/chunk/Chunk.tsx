import React, { memo } from 'react';

// UI
import { Stack } from '@chakra-ui/react';
import ChunkWords from './components/ChunkWords';
import { ChunkToolsContainer } from '@features/chunk-tools';

// Types
import type { ChunkType } from '@mtypes/documents';
import { uiPreferences } from '@mtypes/user';

export interface ChunkProps {
    chunk: ChunkType;
    chunkIdx: number;
    uiPreferences: uiPreferences;
}

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
    uiPreferences
}: ChunkProps) {
    return (
        <Stack direction="row"
            data-chunk-id={chunk.id}
            width="100%"
            borderBottom="1px solid"
            borderColor="border.emphasized"
        >
            <ChunkWords
                chunk={chunk}
                chunkIdx={chunkIdx}
            />
            <ChunkToolsContainer
                chunk={chunk}
                uiPreferences={uiPreferences}
            />
        </Stack>
    );
});

export default Chunk;
