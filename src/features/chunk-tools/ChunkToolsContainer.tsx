// Container component that renders all active chunk tools
// Sticky inside StyledChunk, scrolls with user and stops at end

import React from 'react';
import { styled } from '@styles';
import type { ChunkType } from '@mtypes/documents';

// Stationary Tools
import { ChunkPosition } from '@components/ChunkPosition';
import { CopyTool } from '@features/chunk-copy';
import { ChunkFavoriteToggle } from '@features/chunk-favorite';
import ChunkBookmarkToggle from '@features/chunk-bookmark/components/ChunkBookmarkToggle';

// Tool components
import { NotesTool } from '@features/chunk-note';
import { EvaluationTool } from '@features/chunk-evaluation';
import { ImageTool } from '@features/chunk-image';
import { RewriteDisplayTool } from '@features/chunk-rewrite';
import { ExplanationTool } from '@features/chunk-explanation';

// Update API
import { useUpdateChunkField } from '@hooks/useUpdateChunkField';

// Store
import { useChunkToolsStore } from '@store/chunkToolsStore';

// Types
import { uiPreferences } from '@mtypes/user';

const StickyContainer = styled('div', {
    position: 'sticky',
    top: 24,
    zIndex: 1,
    maxHeight: 'calc(100vh - 32px)',
    overflowY: 'auto',
    width: '320px',
    minWidth: '240px',
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
    background: 'transparent',
});

const StationaryStack = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '$2',
});

function renderStationaryTools(chunk: ChunkType, asRow: boolean, uiPreferences?: uiPreferences) {
    return (
        <StationaryStack style={{ flexDirection: asRow ? 'row' : 'column' }}>
            <ChunkPosition chunk={chunk} uiPreferences={uiPreferences} />
            <CopyTool chunkText={chunk.text} />
            <ChunkBookmarkToggle chunk={chunk} />
            <ChunkFavoriteToggle chunk={chunk} />
        </StationaryStack>
    );
}

interface ChunkToolsContainerProps {
    chunk: ChunkType;
    uiPreferences: uiPreferences;
}

export function ChunkToolsContainer(props: ChunkToolsContainerProps) {
    const { chunk, uiPreferences } = props;
    const updateChunkFieldMutation = useUpdateChunkField();
    const { activeTools } = useChunkToolsStore();

    return (
        <StickyContainer data-chunk-id={`chunk-tools-${chunk.id}`}>
            {renderStationaryTools(chunk, activeTools.length > 0, uiPreferences)}
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
