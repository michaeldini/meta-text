import React from 'react';
import { Box } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';
import NotesIcon from '@mui/icons-material/Notes';
import log from '../../../utils/logger';
import NotesSummaryTab from '../layouts/tabs/NotesSummaryTab';
import ComparisonTab from '../layouts/tabs/ComparisonTab';
import AiImageTab from '../layouts/tabs/AiImageTab';
import { useChunkStore } from '../../../store/chunkStore';
import type { Chunk } from '../../../types/chunk';

interface ChunkToolsDisplayProps {
    chunk: Chunk;
}

const tabOptions = [
    { value: 'notes-summary', icon: <NotesIcon />, key: 'notes-summary' },
    { value: 'comparison', icon: <CompareArrowsIcon />, key: 'comparison' },
    { value: 'ai-image', icon: <PhotoFilterIcon />, key: 'ai-image' },
] as const;

type TabType = typeof tabOptions[number]['value'];

const ChunkToolsDisplay: React.FC<ChunkToolsDisplayProps> = ({ chunk }) => {

    // Use store selectors directly instead of wrapper hooks
    const activeTabs = useChunkStore(state => state.activeTabs);
    const updateChunkField = useChunkStore(state => state.updateChunkField);

    React.useEffect(() => {
        log.info(`ChunkTools mounted (id: ${chunk.id})`);
        return () => log.info(`ChunkTools unmounted (id: ${chunk.id})`);
    }, [chunk.id]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 'fit-content', // Allow container to size to content
        }}>
            <Box sx={{
                // Sticky positioning: stays in view during scroll until parent container boundary
                position: 'sticky',
                top: 20, // Account for navbar height (64px) + some padding (16px)
                alignSelf: 'flex-start', // Ensure it doesn't stretch to full height
                width: '100%', // Take full width of parent
                zIndex: 1, // Ensure it stays above other content when sticky
            }}>
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
        </Box>
    );
};

export default ChunkToolsDisplay;
