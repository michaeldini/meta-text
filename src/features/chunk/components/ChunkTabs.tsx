import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { log } from 'utils';
import type { ChunkType } from 'types';

import { NotesSummaryTab, ComparisonTab, AiImageTab, CompressionToolTab, ExplanationTab } from '../tools';

import { getToolsStyles } from '../Chunk.styles';

interface ChunkTabsProps {
    chunk: ChunkType;
    activeTabs: string[];
    updateChunkField: (chunkId: number, field: keyof ChunkType, value: any) => void;
}

const ChunkTabs: React.FC<ChunkTabsProps> = ({ chunk, activeTabs, updateChunkField }) => {
    const theme = useTheme();
    const styles = getToolsStyles(theme);

    return (
        <Box sx={styles.ChunkTabsContainer}>
            {/* Show Notes/Summary if selected */}
            {activeTabs.includes('notes-summary') && (
                <NotesSummaryTab chunk={chunk} updateChunkField={updateChunkField} />
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
                <CompressionToolTab chunk={chunk} />
            )}
            {/* Show Explanation if selected */}
            {activeTabs.includes('explanation') && (
                <ExplanationTab chunk={chunk} updateChunkField={updateChunkField} />
            )}
        </Box>
    );
};

export default ChunkTabs;
