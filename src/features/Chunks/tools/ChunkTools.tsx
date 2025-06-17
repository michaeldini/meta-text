import React from 'react';
import { Box } from '@mui/material';
import { useDebouncedField } from '../../../hooks/useDebouncedField';
import { useImageGeneration } from '../../../hooks/useImageGeneration';
import log from '../../../utils/logger';
import SummaryNotesComponent from './SummaryNotesComponent';
import ChunkToolsTabs from './ChunkToolsTabs';
import { useChunkStore } from '../../../store/chunkStore';

interface ChunkToolsProps {
    chunk: any;
    chunkIdx: number;
    handleChunkFieldChange: (chunkIdx: number, field: string, value: any) => void;
}

const ChunkTools: React.FC<ChunkToolsProps> = ({ chunk, chunkIdx, handleChunkFieldChange }) => {
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
    const closeDialog = () => setImageState(s => ({ ...s, dialogOpen: false }));
    const handleGenerate = (prompt: string, chunkId: number) => {
        setImageState(s => ({ ...s, dialogOpen: false }));
    };
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

    // Use selector to only subscribe to activeTab and setActiveTab
    const { activeTab, setActiveTab } = useChunkStore(state => ({
        activeTab: state.activeTab,
        setActiveTab: state.setActiveTab,
    }));

    const handleComparisonUpdate = (newComparison: string) => handleChunkFieldChange(chunkIdx, 'comparison', newComparison);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <SummaryNotesComponent
                summary={summary}
                notes={notes}
                setSummary={setSummary}
                setNotes={setNotes}
                onSummaryBlur={() => handleChunkFieldChange(chunkIdx, 'summary', summary)}
                onNotesBlur={() => handleChunkFieldChange(chunkIdx, 'notes', notes)}
            />
            <ChunkToolsTabs
                chunk={chunk}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                imageState={imageState}
                openDialog={openDialog}
                getImgSrc={getImgSrc}
                setImageLoaded={setImageLoaded}
                setLightboxOpen={setLightboxOpen}
                handleComparisonUpdate={handleComparisonUpdate}
            />
        </Box>
    );
};

export default ChunkTools;
