// Container component that renders all active chunk tools
// Replaces the old ChunkTabs component with a simpler, more direct approach

import React, { Suspense } from 'react';
import { Box, Stack, } from '@chakra-ui/react';
import { ErrorBoundary } from 'components';
import { CopyTool } from 'features/chunk-copy';
import type { ChunkType, UpdateChunkFieldFn } from 'types';
import type { ChunkToolId } from './toolsRegistry';

import ChunkPosition from './ChunkPosition';

import { NotesTool } from 'features/chunk-note';
import { EvaluationTool } from 'features/chunk-evaluation';
import { ImageTool } from 'features/chunk-image';
import { RewriteDisplayTool } from 'features/chunk-rewrite';
import { ExplanationTool } from 'features/chunk-explanation';
import { ChunkBookmarkToggle } from 'features/chunk-bookmark';
import { ChunkFavoriteToggle } from 'features/chunk-favorite';


interface ChunkToolsContainerProps {
    chunk: ChunkType;
    activeTools: ChunkToolId[];
    updateChunkField: UpdateChunkFieldFn;
}
export const ChunkToolsContainer: React.FC<ChunkToolsContainerProps> = (props) => {
    const { chunk, activeTools, updateChunkField } = props;



    return (
        <Box data-chunk-id={`chunk-tools-${chunk.id}`}>
            {/* Tools Always visible at the top */}
            <Stack
                flexDirection={activeTools.length > 0 ? 'row' : 'column'}
                alignItems="center"
            >
                {/* Chunk position display (logic encapsulated in component) */}
                <ChunkPosition chunk={chunk} />
                <CopyTool chunkText={chunk.text} />
                <ChunkBookmarkToggle chunk={chunk} />
                <ChunkFavoriteToggle chunk={chunk} />
            </Stack>
            {/* Chunk tools, each wrapped in ToolBoundary for error/loading isolation */}
            {activeTools.includes('note-summary') && (

                <NotesTool
                    chunk={chunk}
                    updateChunkField={updateChunkField}
                    isVisible={true}
                />

            )}
            {activeTools.includes('evaluation') && (
                <EvaluationTool
                    chunk={chunk}
                    updateChunkField={updateChunkField}
                    isVisible={true}
                />
            )}
            {activeTools.includes('image') && (
                <ImageTool
                    chunk={chunk}
                    updateChunkField={updateChunkField}
                    isVisible={true}
                />
            )}
            {activeTools.includes('rewrite') && (
                <RewriteDisplayTool
                    chunk={chunk}
                    updateChunkField={updateChunkField}
                    isVisible={true}
                />
            )}
            {activeTools.includes('explanation') && (
                <ExplanationTool
                    chunk={chunk}
                    updateChunkField={updateChunkField}
                    isVisible={true}
                />
            )}
        </Box>
    );
};

export default ChunkToolsContainer;
