import React, { memo, useMemo } from 'react';
import { Box, Stack } from '@chakra-ui/react';

import { useChunkToolsStore } from '@store/chunkToolsStore';

import ChunkWords from './components/ChunkWords';
import { ChunkToolsContainer } from '@features/chunk-tools';
import { useUpdateChunkField } from '@hooks/useUpdateChunkField';
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
    const { activeTabs } = useChunkToolsStore();
    const updateChunkFieldMutation = useUpdateChunkField();
    return (
        <Stack direction="row"
            data-chunk-id={chunk.id}
            width="100%"
            borderBottom="1px solid"
            borderColor="border.subtle"
        >
            <ChunkWords
                chunk={chunk}
                chunkIdx={chunkIdx}
            />
            <ChunkToolsContainer
                chunk={chunk}
                activeTools={activeTabs}
                updateChunkFieldMutation={updateChunkFieldMutation}
                uiPreferences={uiPreferences}
            />
        </Stack>
    );
});

export default Chunk;
