import React, { memo } from 'react';

// UI
import ChunkWords from './components/ChunkWords';
import { ChunkToolsContainer } from '@features/chunk-tools';
import { styled } from '@styles';

// Types
import type { ChunkType } from '@mtypes/documents';
import { uiPreferences } from '@mtypes/user';

export interface ChunkProps {
    chunk: ChunkType;
    chunkIdx: number;
    uiPreferences: uiPreferences;
}

const StyledChunk = styled('div', {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '$4',
    borderRadius: '$md',
    backgroundColor: '$gray50',
    gap: '$4',
});

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
    uiPreferences
}: ChunkProps) {
    return (
        <StyledChunk data-chunk-id={chunk.id}>
            <ChunkWords
                chunk={chunk}
                chunkIdx={chunkIdx}
                uiPreferences={uiPreferences}
            />
            <ChunkToolsContainer
                chunk={chunk}
                uiPreferences={uiPreferences}
            />
        </StyledChunk>
    );
});

export default Chunk;
