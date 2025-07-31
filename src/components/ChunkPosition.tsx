// Displays the position of a chunk if enabled in user preferences
// Encapsulates logic for reading user config and conditional rendering

import React from 'react';
import { Text } from '@chakra-ui/react';
import { useUserConfig } from 'services/userConfigService';
import type { ChunkType } from 'types';

interface ChunkPositionProps {
    chunk: ChunkType;
}
export function ChunkPosition({ chunk }: ChunkPositionProps) {
    const { data: userConfig } = useUserConfig();
    const showChunkPositions = userConfig?.uiPreferences?.showChunkPositions ?? false;

    if (!showChunkPositions) return null;

    return (
        <Text>
            {chunk.position}
        </Text>
    );
};

export default ChunkPosition;
