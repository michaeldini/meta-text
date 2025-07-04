import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { log } from 'utils';
import type { ChunkType, UpdateChunkFieldFn } from 'types';

import { NotesTab, ComparisonTab, AiImageTab, CompressionTab, ExplanationTab } from '../tools';

import { getToolsStyles } from '../Chunk.styles';

interface ChunkTabsProps {
    chunk: ChunkType;
    activeTabs: string[];
    updateChunkField: UpdateChunkFieldFn;
}

const ChunkTabs: React.FC<ChunkTabsProps> = ({ chunk, activeTabs, updateChunkField }) => {
    const theme = useTheme();

    // pass activeTabs to styles to toggle visibility
    const styles = getToolsStyles(theme, activeTabs.length > 0);

    return (
        <Box sx={styles.ChunkTabsContainer}>
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
