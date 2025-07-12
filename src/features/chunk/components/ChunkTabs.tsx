// Tabs that appear in the Chunk component
// Each tab corresponds to a specific tool or feature related to the chunk
// This component renders the tabs based on the activeTabs prop

import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { log } from 'utils';
import type { ChunkType, UpdateChunkFieldFn } from 'types';

import { NotesTab } from 'features/chunk-notes';
import { ComparisonTab } from 'features/chunk-comparison';
import { ImageTab as AiImageTab } from 'features/chunk-image';
import { CompressionTab } from 'features/chunk-compression';
import { ExplanationTab } from 'features/chunk-explanation';
import { CopyTool } from 'features/chunk-copy';

import { getChunkComponentsStyles } from '../Chunk.styles';


interface ChunkTabsProps {
    chunk: ChunkType;
    activeTabs: string[];
    updateChunkField: UpdateChunkFieldFn;
}

const ChunkTabs: React.FC<ChunkTabsProps> = ({ chunk, activeTabs, updateChunkField }) => {
    const theme = useTheme();

    // pass activeTabs to styles to toggle visibility
    const styles = getChunkComponentsStyles(theme, activeTabs.length > 0);

    return (
        <Box sx={styles.chunkTabsContainer}>
            {/* Copy Tool - Always visible at the top */}
            <CopyTool
                chunkText={chunk.text}
                sx={styles.copyToolContainer}
            />

            {/* Show Notes if selected */}
            {activeTabs.includes('notes-summary') && (
                <NotesTab chunk={chunk} updateChunkField={updateChunkField} />
            )}
            {/* Show Comparison if selected */}
            {activeTabs.includes('comparison') && (
                <ComparisonTab chunk={chunk} updateChunkField={updateChunkField} />
            )}
            {/* Show AI Image if selected */}
            {activeTabs.includes('ai-image') && (
                <AiImageTab chunk={chunk} />
            )}
            {/* Show Compression if selected */}
            {activeTabs.includes('compression') && (
                <CompressionTab chunk={chunk} />
            )}
            {/* Show Explanation if selected */}
            {activeTabs.includes('explanation') && (
                <ExplanationTab chunk={chunk} updateChunkField={updateChunkField} />
            )}
        </Box>
    );
};

export default ChunkTabs;
