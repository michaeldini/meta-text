import React from 'react';
import { Stack } from '@chakra-ui/react/stack';
import Chunk from '@features/chunk/Chunk';
import type { ChunkType } from '@mtypes/documents';

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

    return (
        <Stack gap={4} data-testid="chunk-list">
            {chunks.map((chunk: ChunkType, idx: number) => (
                <Chunk key={chunk.id} chunk={chunk} chunkIdx={startIndex + idx} />
            ))}
        </Stack>
    );
};
