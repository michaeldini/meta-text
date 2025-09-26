/**
 * Chunk Component
 * 
 * This component represents a single chunk of text within a document.
 * It displays the words in the chunk and provides tools for interacting with the chunk.
 * 
 * It is a simple presentation component that displays the chunk data and tools in a row layout.
 */

import React, { memo } from 'react';

/** Component to display the words in a chunk */
import ChunkWords from './components/ChunkWords';

/** 
 * Container for chunk tools other than word selection tools.
 * These tools live in on the side of the chunk.
 */
import { ChunkToolsContainer } from '@features/chunk-tools';

/** Component to display the position of the chunk within the document */
import { ChunkPosition } from '@components/ChunkPosition';

// Types
import type { ChunkType } from '@mtypes/documents';
import { uiPreferences } from '@mtypes/user';

// UI
import { Row } from '@styles';

export interface ChunkProps {
    /** The chunk data to be displayed. */
    chunk: ChunkType;
    /** User interface preferences for rendering the chunk. */
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
            />
            <ChunkPosition position={chunk.position} visible={uiPreferences.showChunkPositions} />

        </Row>
    );
});

export default Chunk;
