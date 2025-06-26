import React from 'react';
import { Box } from '@mui/material';
import { CompareArrowsIcon, PhotoFilterIcon, NotesIcon } from '../../../components/icons';
import log from '../../../utils/logger';
import NotesSummaryTab from '../layouts/tabs/NotesSummaryTab';
import ComparisonTab from '../layouts/tabs/ComparisonTab';
import AiImageTab from '../layouts/tabs/AiImageTab';
import { useChunkStore } from '../../../store/chunkStore';
import type { Chunk } from '../../../types/chunk';
import { getChunkToolsStyles } from './styles/styles';
import { useTheme } from '@mui/material/styles';

interface ChunkToolsDisplayProps {
    chunk: Chunk;
}

const tabOptions = [
    { value: 'notes-summary', icon: <NotesIcon style={{ width: 20, height: 20 }} />, key: 'notes-summary' },
    { value: 'comparison', icon: <CompareArrowsIcon style={{ width: 20, height: 20 }} />, key: 'comparison' },
    { value: 'ai-image', icon: <PhotoFilterIcon style={{ width: 20, height: 20 }} />, key: 'ai-image' },
] as const;

const ChunkToolsDisplay: React.FC<ChunkToolsDisplayProps> = ({ chunk }) => {
    const theme = useTheme();
    const styles = React.useMemo(() => getChunkToolsStyles(theme), [theme]);

    // Use store selectors directly instead of wrapper hooks
    const activeTabs = useChunkStore(state => state.activeTabs);
    const updateChunkField = useChunkStore(state => state.updateChunkField);

    React.useEffect(() => {
        log.info(`ChunkTools mounted (id: ${chunk.id})`);
        return () => log.info(`ChunkTools unmounted (id: ${chunk.id})`);
    }, [chunk.id]);

    return (
        <Box sx={styles.box}>
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
        </Box>
    );
};

export default ChunkToolsDisplay;
