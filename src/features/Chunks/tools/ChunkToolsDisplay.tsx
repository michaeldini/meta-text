import React from 'react';
import { Box } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';
import NotesIcon from '@mui/icons-material/Notes';
import { useDebouncedField } from '../../../hooks/useDebouncedField';
import { useImageGeneration } from '../../../hooks/useImageGeneration';
import log from '../../../utils/logger';
import SummaryNotesComponent from './summarynotes/SummaryNotesComponent';
import ChunkComparisonPanel from './comparison/ChunkComparisonPanel';
import ChunkImageDisplay from './image/Display';
import { useChunkStore } from '../../../store/chunkStore';

interface ChunkToolsDisplayProps {
    chunk: any;
    chunkIdx: number;
    handleChunkFieldChange: (chunkIdx: number, field: string, value: any) => void;
}

const tabOptions = [
    { value: 'notes-summary', icon: <NotesIcon />, key: 'notes-summary' },
    { value: 'comparison', icon: <CompareArrowsIcon />, key: 'comparison' },
    { value: 'ai-image', icon: <PhotoFilterIcon />, key: 'ai-image' },
] as const;

type TabType = typeof tabOptions[number]['value'];

const ChunkToolsDisplay: React.FC<ChunkToolsDisplayProps> = ({ chunk, chunkIdx, handleChunkFieldChange }) => {
    // Debounced fields
    const [summary, setSummary] = useDebouncedField(
        chunk.summary || '',
        (val: string) => handleChunkFieldChange(chunkIdx, 'summary', val),
        800
    );
    const [notes, setNotes] = useDebouncedField(
        chunk.notes || '',
        (val: string) => handleChunkFieldChange(chunkIdx, 'notes', val),
        800
    );

    // Image state
    const { state: imageState, setState: setImageState, getImgSrc, openDialog } = useImageGeneration(chunk);
    const setLightboxOpen = (open: boolean) => setImageState(s => ({ ...s, lightboxOpen: open }));
    const setImageLoaded = (loaded: boolean) => setImageState(s => ({ ...s, loaded }));

    React.useEffect(() => {
        log.info(`ChunkTools mounted (id: ${chunk.id})`);
        return () => log.info(`ChunkTools unmounted (id: ${chunk.id})`);
    }, [chunk.id]);

    React.useEffect(() => {
        if (imageState.loading) log.info(`Image generation started for chunk id: ${chunk.id}`);
        if (imageState.error) log.error(`Image generation error for chunk id: ${chunk.id}:`, imageState.error);
        if (imageState.data) log.info(`Image retrieved for chunk id: ${chunk.id}`);
    }, [imageState.loading, imageState.error, imageState.data, chunk.id]);

    // Use selector to only subscribe to activeTabs
    const activeTabs = useChunkStore(state => state.activeTabs);

    const handleComparisonUpdate = (newComparison: string) => handleChunkFieldChange(chunkIdx, 'comparison', newComparison);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Show Notes/Summary if selected */}
            {activeTabs.includes('notes-summary') && (
                <SummaryNotesComponent
                    summary={summary}
                    notes={notes}
                    setSummary={setSummary}
                    setNotes={setNotes}
                    onSummaryBlur={() => handleChunkFieldChange(chunkIdx, 'summary', summary)}
                    onNotesBlur={() => handleChunkFieldChange(chunkIdx, 'notes', notes)}
                />
            )}
            {/* Show Comparison if selected */}
            {activeTabs.includes('comparison') && (
                <ChunkComparisonPanel
                    chunkId={chunk.id}
                    comparisonText={chunk.comparison}
                    onComparisonUpdate={handleComparisonUpdate}
                />
            )}
            {/* Show AI Image if selected */}
            {activeTabs.includes('ai-image') && (
                <ChunkImageDisplay
                    imageState={imageState}
                    openDialog={openDialog}
                    getImgSrc={getImgSrc}
                    setImageLoaded={setImageLoaded}
                    setLightboxOpen={setLightboxOpen}
                    imgPrompt={imageState.prompt}
                    createdAt={chunk.ai_image && chunk.ai_image.created_at}
                />
            )}
        </Box>
    );
};

export default ChunkToolsDisplay;
