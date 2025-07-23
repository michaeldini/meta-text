// Container component that renders all active chunk tools
// Replaces the old ChunkTabs component with a simpler, more direct approach

import React, { Suspense } from 'react';
import { Box, useTheme } from '@mui/material';
import { ErrorBoundary, LoadingBoundary } from 'components';
import { CopyTool } from 'features/chunk-copy';
import ChunkBookmarkToggle from '../chunk-bookmark/ChunkBookmarkToggle';
import ChunkFavoriteToggle from '../chunk-favorite/ChunkFavoriteToggle';
import { getChunkComponentsStyles } from '../chunk/Chunk.styles';
import type { ChunkType, UpdateChunkFieldFn } from 'types';
import type { ChunkToolId } from './toolsRegistry';

// Import all tool components directly to avoid lazy loading complexity
import NotesTool from '../chunk-note/NotesTool';
import EvaluationTool from '../chunk-evaluation/EvaluationTool';
import ImageTool from '../chunk-image/ImageTool';
import RewriteDisplayTool from '../chunk-rewrite/RewriteDisplayTool';
import ExplanationTool from '../chunk-explanation/ExplanationTool';
import { useUserConfig } from 'services/userConfigService';

interface ChunkToolsContainerProps {
    chunk: ChunkType;
    activeTools: ChunkToolId[];
    updateChunkField: UpdateChunkFieldFn;
}

const ChunkToolsContainer: React.FC<ChunkToolsContainerProps> = ({
    chunk,
    activeTools,
    updateChunkField
}) => {
    const theme = useTheme();
    const styles = getChunkComponentsStyles(theme, activeTools.length > 0);
    const { data: userConfig } = useUserConfig();
    const uiPrefs = userConfig?.uiPreferences || {};

    const showChunkPositions = uiPrefs.showChunkPositions ?? false;


    return (
        <Box sx={styles.chunkTabsContainer}
            data-chunk-id={`chunk-tools-${chunk.id}`}>
            {/* Tools Always visible at the top */}
            <Box sx={styles.alwaysVisibleToolContainer}>
                {/* Chunk position display in top right corner */}
                {showChunkPositions && (
                    <Box >
                        {chunk.position}
                    </Box>
                )}
                <CopyTool chunkText={chunk.text} />
                {/* Bookmark toggle button */}
                <ChunkBookmarkToggle chunk={chunk} />
                <ChunkFavoriteToggle chunk={chunk} />
            </Box>
            <ErrorBoundary>
                <Suspense fallback={<LoadingBoundary loading={true}><div /></LoadingBoundary>}>
                    {/* Notes Tool */}
                    {activeTools.includes('note-summary') && (
                        <NotesTool
                            chunk={chunk}
                            updateChunkField={updateChunkField}
                            isVisible={true}
                        />
                    )}

                    {/* Evaluation Tool */}
                    {activeTools.includes('evaluation') && (
                        <EvaluationTool
                            chunk={chunk}
                            updateChunkField={updateChunkField}
                            isVisible={true}
                        />
                    )}

                    {/* Image Tool */}
                    {activeTools.includes('image') && (
                        <ImageTool
                            chunk={chunk}
                            updateChunkField={updateChunkField}
                            isVisible={true}
                        />
                    )}

                    {/* Rewrite Tool */}
                    {activeTools.includes('rewrite') && (
                        <RewriteDisplayTool
                            chunk={chunk}
                            updateChunkField={updateChunkField}
                            isVisible={true}
                        />
                    )}

                    {/* Explanation Tool */}
                    {activeTools.includes('explanation') && (
                        <ExplanationTool
                            chunk={chunk}
                            updateChunkField={updateChunkField}
                            isVisible={true}
                        />
                    )}
                </Suspense>
            </ErrorBoundary>
        </Box>
    );
};

export default ChunkToolsContainer;
