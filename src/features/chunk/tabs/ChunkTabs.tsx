import React from 'react';
import { Box } from '@mui/material';
import { CompareArrowsIcon, PhotoFilterIcon, NotesIcon, CompressionIcon } from '../../../components/icons';
import { log } from 'utils';
import { NotesSummaryTab, ComparisonTab, AiImageTab, CompressionToolTab } from '../tools';
import ExplanationTab from '../tools/explanation/ExplanationTab';
import { useChunkStore } from '../../../store/chunkStore';
import type { ChunkType } from 'types';
import { getToolsStyles } from './ChunkTabs.styles';
import { useTheme } from '@mui/material/styles';

interface ChunkTabsProps {
    chunk: ChunkType;
}

const tabOptions = [
    { value: 'notes-summary', icon: <NotesIcon />, key: 'notes-summary' },
    { value: 'comparison', icon: <CompareArrowsIcon />, key: 'comparison' },
    { value: 'ai-image', icon: <PhotoFilterIcon />, key: 'ai-image' },
    { value: 'compression', icon: <CompressionIcon />, key: 'compression' },
    { value: 'explanation', icon: <NotesIcon />, key: 'explanation' },
] as const;

const ChunkTabs: React.FC<ChunkTabsProps> = ({ chunk }) => {
    const theme = useTheme();
    const styles = React.useMemo(() => getToolsStyles(theme), [theme]);

    // Use store selectors directly instead of wrapper hooks
    const activeTabs = useChunkStore(state => state.activeTabs);
    const updateChunkField = useChunkStore(state => state.updateChunkField);

    React.useEffect(() => {
        log.info(`ChunkTools mounted (id: ${chunk.id})`);
        return () => log.info(`ChunkTools unmounted (id: ${chunk.id})`);
    }, [chunk.id]);

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
