import React, { memo } from 'react';

// UI
import ChunkWords from './components/ChunkWords';
import { ChunkToolsContainer } from '@features/chunk-tools';
import { Row } from '@styles';

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
        <Row
            noWrap
            data-chunk-id={chunk.id}
            data-testid={`chunk-${chunkIdx}`}
        >
            <ChunkWords
                chunk={chunk}
                chunkIdx={chunkIdx}
                uiPreferences={uiPreferences}
            />
            <ChunkToolsContainer
                chunk={chunk}
                uiPreferences={uiPreferences}
            />
        </Row>
    );
});

export default Chunk;
