// Container component that renders all active chunk tools
// Replaces the old ChunkTabs component with a simpler, more direct approach

import React from 'react';
import { Box, Stack, } from '@chakra-ui/react';
import { Boundary } from 'components/Boundaries';
import { Spinner } from '@chakra-ui/react';
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
function ChunkToolsContainer(props: ChunkToolsContainerProps) {
    // Destructure props for easier access  
    const { chunk, activeTools, updateChunkField } = props;

    // Helper to wrap each tool with error and suspense boundaries
    const ToolBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <Boundary fallback={<Spinner aria-label="Loading content" />}>{children}</Boundary>
    );


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
                <ToolBoundary>
                    <NotesTool
                        chunk={chunk}
                        updateChunkField={updateChunkField}
                        isVisible={true}
                    />
                </ToolBoundary>
            )}
            {activeTools.includes('evaluation') && (
                <ToolBoundary>
                    <EvaluationTool
                        chunk={chunk}
                        updateChunkField={updateChunkField}
                        isVisible={true}
                    />
                </ToolBoundary>
            )}
            {activeTools.includes('image') && (
                <ToolBoundary>
                    <ImageTool
                        chunk={chunk}
                        updateChunkField={updateChunkField}
                        isVisible={true}
                    />
                </ToolBoundary>
            )}
            {activeTools.includes('rewrite') && (
                <ToolBoundary>
                    <RewriteDisplayTool
                        chunk={chunk}
                        updateChunkField={updateChunkField}
                        isVisible={true}
                    />
                </ToolBoundary>
            )}
            {activeTools.includes('explanation') && (
                <ToolBoundary>
                    <ExplanationTool
                        chunk={chunk}
                        updateChunkField={updateChunkField}
                        isVisible={true}
                    />
                </ToolBoundary>
            )}
        </Box>
    );
}

export default ChunkToolsContainer;
