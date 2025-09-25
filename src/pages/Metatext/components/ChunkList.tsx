/**
 * A list of Chunk components.
 * 
 * Each chunk is rendered using the Chunk component.
 * The list is displayed in a column layout with spacing between chunks.
 * Props:
 * - chunks: An array of chunk objects to be displayed.
 * 
 */
import React, { useMemo } from 'react';

/** The main chunk component */
import Chunk from '@features/chunk/Chunk';

/** Hook to fetch user configuration and ui preferences. */
import { getPreferences, useUserConfig } from '@services/userConfigService';

// Types
import type { ChunkType } from '@mtypes/documents';

// UI
import { Column } from '@styles';

interface ChunkListProps {
    /** An array of chunk objects to be displayed. */
    chunks: ChunkType[];
}

/**
 * ChunkList - Renders a list of Chunk components
 */
export function ChunkList({ chunks }: ChunkListProps) {

    /**
     * Why use memoization here?
     * - Memoization helps to prevent unnecessary re-renders of the Chunk components.
     * - Each Chunk component may have its own internal state and complex rendering logic.
     * - By memoizing the chunks array, we ensure that each Chunk component only re-renders
     *   when its specific data changes, rather than on every parent render.
     */
    const memoizedChunks = useMemo(() => chunks, [chunks]);

    /**
     * Fetch user configuration to determine UI preferences.
     * We only need get the user preferences, not update them here, since we use them to render the chunks with the correct styles.
     * We expose this here so that each Chunk component does not need to fetch the user config individually.
     */
    const { data: userConfig } = useUserConfig();
    const uiPreferences = useMemo(() => getPreferences(userConfig).uiPreferences, [userConfig]);

    if (!chunks || chunks.length === 0) {
        return null;
    }

    return (
        <Column
            gap="2"
            data-testid="chunk-list"
        >
            {memoizedChunks.map((chunk: ChunkType) => (
                <Chunk
                    key={chunk.id}
                    chunk={chunk}
                    uiPreferences={uiPreferences} />
            ))}
        </Column >
    );
}
