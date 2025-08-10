// Container component that renders all active chunk tools
// Replaces the old ChunkTabs component with a simpler, more direct approach

import React, { Suspense } from 'react';
import { Box, Stack, } from '@chakra-ui/react';
import { CopyTool } from '@features/chunk-copy';
import type { ChunkType, UseUpdateChunkFieldType } from '@mtypes/documents';
import type { ChunkToolId } from './toolsRegistry';

import { ChunkPosition } from '@components/ChunkPosition';

import { NotesTool } from '@features/chunk-note';
import { EvaluationTool } from '@features/chunk-evaluation';
import { ImageTool } from '@features/chunk-image';
import { RewriteDisplayTool } from '@features/chunk-rewrite';
import { ExplanationTool } from '@features/chunk-explanation';
import { ChunkFavoriteToggle } from '@features/chunk-favorite';
import ChunkBookmarkToggle from '@features/chunk-bookmark/components/ChunkBookmarkToggle';
import { uiPreferences } from '@mtypes/user';

interface ChunkToolsContainerProps {
    chunk: ChunkType;
    activeTools: ChunkToolId[];
    updateChunkFieldMutation: UseUpdateChunkFieldType;
    uiPreferences: uiPreferences;
}

function renderStationaryTools(chunk: ChunkType, asRow: boolean, uiPreferences?: uiPreferences) {
    return (
        <Stack
            flexDirection={asRow ? 'row' : 'column'}
            alignItems="center"
        >
            {/* Chunk position display (logic encapsulated in component) */}
            <ChunkPosition chunk={chunk} uiPreferences={uiPreferences} />
            <CopyTool chunkText={chunk.text} />
            {/* Replace with your own toggle component */}
            <ChunkBookmarkToggle chunk={chunk} />
            <ChunkFavoriteToggle chunk={chunk} />
        </Stack>
    );
}

export const ChunkToolsContainer: React.FC<ChunkToolsContainerProps> = (props) => {
    const { chunk, activeTools, updateChunkFieldMutation, uiPreferences } = props;



    return (
        <Box data-chunk-id={`chunk-tools-${chunk.id}`}
            width={activeTools.length > 0 ? '1/3' : '1/12'}
        >
            {/* Main sticky stack */}
            <Stack
                position="sticky"
                top={12}
                zIndex={1}>

                {/* Tools Always visible at the top */}
                {renderStationaryTools(chunk, activeTools.length > 0, uiPreferences)}

                {/* Chunk tools, each wrapped in ToolBoundary for error/loading isolation */}
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
            </Stack>

        </Box>
    );
};

export default ChunkToolsContainer;
