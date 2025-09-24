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
    uiPreferences: uiPreferences;
}

const Chunk = memo(function Chunk({
    chunk,
    uiPreferences
}: ChunkProps) {
    return (
        <Row
            noWrap
            data-chunk-id={chunk.id}
        >
            <ChunkWords
                chunk={chunk}
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
