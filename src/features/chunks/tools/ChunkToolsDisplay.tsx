import React from 'react';
import { Box } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';
import NotesIcon from '@mui/icons-material/Notes';
import { useImageGeneration } from './image/useImageGeneration';
import log from '../../../utils/logger';
import NotesSummaryTab from './tabs/NotesSummaryTab';
import ComparisonTab from './tabs/ComparisonTab';
import AiImageTab from './tabs/AiImageTab';
import { useImageGenerationHandler } from './image/useImageGenerationHandler';
import { useChunkTabState } from './hooks/useChunkTabState';
import { useChunkFieldUpdater } from './hooks/useChunkFieldUpdater';
import type { Chunk } from '../../../types/chunk';

interface ChunkToolsDisplayProps {
    chunk: Chunk;
    // chunkIdx: number;
    // handleChunkFieldChange: (chunkId: number, field: keyof Chunk, value: any) => void;
}

const tabOptions = [
    { value: 'notes-summary', icon: <NotesIcon />, key: 'notes-summary' },
    { value: 'comparison', icon: <CompareArrowsIcon />, key: 'comparison' },
    { value: 'ai-image', icon: <PhotoFilterIcon />, key: 'ai-image' },
] as const;

type TabType = typeof tabOptions[number]['value'];

// const ChunkToolsDisplay: React.FC<ChunkToolsDisplayProps> = ({ chunk, chunkIdx }) => {
const ChunkToolsDisplay: React.FC<ChunkToolsDisplayProps> = ({ chunk }) => {

    // Use custom hooks for store state and updates
    const activeTabs = useChunkTabState();
    const updateChunkField = useChunkFieldUpdater();

    React.useEffect(() => {
        log.info(`ChunkTools mounted (id: ${chunk.id})`);
        return () => log.info(`ChunkTools unmounted (id: ${chunk.id})`);
    }, [chunk.id]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
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
