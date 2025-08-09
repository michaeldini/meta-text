import React, { useMemo } from 'react';
import { Stack } from '@chakra-ui/react/stack';
import Chunk from '@features/chunk/Chunk';
import type { ChunkType } from '@mtypes/documents';
import { useUserConfig } from '@services/userConfigService';
import getUiPreferences from '@utils/getUiPreferences';

interface ChunkListProps {
    chunks: ChunkType[];
    startIndex: number;
}

/**
 * ChunkList - Renders a list of Chunk components
 */
export const ChunkList: React.FC<ChunkListProps> = ({ chunks, startIndex }) => {
    if (!chunks || chunks.length === 0) {
        return null;
    }

    // Memoize chunks to ensure stable references for Chunk components
    const memoizedChunks = useMemo(() => chunks, [chunks]);
    const { data: userConfig } = useUserConfig();
    const uiPreferences = getUiPreferences(userConfig);


    return (
        <Stack gap={4} data-testid="chunk-list">
            {memoizedChunks.map((chunk: ChunkType, idx: number) => (
                <Chunk key={chunk.id} chunk={chunk} chunkIdx={startIndex + idx} uiPreferences={uiPreferences} />
            ))}
        </Stack>
    );
};
