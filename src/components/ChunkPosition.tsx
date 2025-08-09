// Displays the position of a chunk if enabled in user preferences
// Encapsulates logic for reading user config and conditional rendering

import React from 'react';
import { Text } from '@chakra-ui/react';
import type { ChunkType } from '@mtypes/documents';
import { uiPreferences } from '@mtypes/user';

interface ChunkPositionProps {
    chunk: ChunkType;
    uiPreferences?: uiPreferences;
}
export function ChunkPosition({ chunk, uiPreferences }: ChunkPositionProps) {
    const showChunkPositions = uiPreferences?.showChunkPositions ?? false;

    if (!showChunkPositions) return null;

    return (
        <Text>
            {chunk.position}
        </Text>
    );
};

export default ChunkPosition;
