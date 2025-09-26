/**
 * Chunk Tools Container
 * 
 * This component serves as a container for various tools associated with a text chunk.
 * It includes stationary tools like copy, bookmark, and favorite toggles, as well as
 * dynamic tools such as notes, evaluations, images, rewrites, and explanations.
 * 
 * The visibility of dynamic tools is controlled by the application's state, allowing
 * users to customize their interface based on their preferences.
 * 
 * Note:
 *  The tools are designed to be context-aware, receiving the chunk data as props
 *  to ensure they operate on the correct chunk.
 */
import React from 'react';
import { Column, StickyContainer } from '@styles';
import type { ChunkType } from '@mtypes/documents';

// Tool components
import { CopyTool } from '@features/chunk-copy';
import { ChunkFavoriteToggle } from '@features/chunk-favorite';
import ChunkBookmarkToggle from '@features/chunk-bookmark/components/ChunkBookmarkToggle';
import { NotesTool } from '@features/chunk-note';
import { EvaluationTool } from '@features/chunk-evaluation';
import { ImageTool } from '@features/chunk-image';
import { RewriteDisplayTool } from '@features/chunk-rewrite';
import { ExplanationTool } from '@features/chunk-explanation';

/**
 * This hook is used to update specific fields of a chunk.
 * It provides a mutation function that can be called to perform the update.
 */
import { useUpdateChunkField } from '@hooks/useUpdateChunkField';

/**
 * This store manages the state of active chunk tools.
 * It provides access to the list of currently active tools, allowing components to render tools conditionally.
 */
import { useChunkToolsStore } from '@store/chunkToolsStore';


interface StationaryToolsProps {
    /** The chunk data to which the tools are associated. */
    chunk: ChunkType;
    /** Determines if the tools should be displayed in a row layout. */
    asRow: boolean;
}

/**
 * StationaryTools Component
 * 
 * This component renders tools that are always visible alongside the chunk.
 * It includes tools for copying text, toggling bookmarks, and marking favorites.
 * The layout can be adjusted to be either row or column based on the `asRow` prop.
 */
function StationaryTools({ chunk, asRow }: StationaryToolsProps) {
    return (
        <Column style={{ gap: 0, flexDirection: asRow ? 'row' : 'column' }}>
            <CopyTool chunkText={chunk.text} />
            <ChunkBookmarkToggle chunk={chunk} />
            <ChunkFavoriteToggle chunk={chunk} />
        </Column>
    );
}

interface ChunkToolsContainerProps {
    chunk: ChunkType;
}

export function ChunkToolsContainer({ chunk }: ChunkToolsContainerProps) {

    /**
     * Mutation hook to update specific fields of the chunk.
     * This is used by tools like NotesTool to save changes to the chunk data.
     */
    const updateChunkFieldMutation = useUpdateChunkField();

    /**
     * Access the list of active tools from the chunk tools store.
     * This determines which dynamic tools should be rendered.
     */
    const { activeTools } = useChunkToolsStore();

    return (
        <StickyContainer data-chunk-id={`chunk-tools-${chunk.id}`}>
            <StationaryTools chunk={chunk} asRow={activeTools.length > 0} />
            {activeTools.includes('note-summary') && (
                <NotesTool
                    chunk={chunk}
                    mutateChunkField={updateChunkFieldMutation.mutate}
                    isVisible={true}
                />
            )}
            {activeTools.includes('evaluation') && (
                <EvaluationTool
                    chunk={chunk}
                    isVisible={true}
                />
            )}
            {activeTools.includes('image') && (
                <ImageTool
                    chunk={chunk}
                    isVisible={true}
                />
            )}
            {activeTools.includes('rewrite') && (
                <RewriteDisplayTool
                    chunk={chunk}
                    isVisible={true}
                />
            )}
            {activeTools.includes('explanation') && (
                <ExplanationTool
                    chunk={chunk}
                    isVisible={true}
                />
            )}
        </StickyContainer>
    );
}

export default ChunkToolsContainer;
