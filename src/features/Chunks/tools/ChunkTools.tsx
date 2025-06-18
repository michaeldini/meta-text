import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';
import { useDebouncedField } from '../../../hooks/useDebouncedField';
import { useImageGeneration } from '../../../hooks/useImageGeneration';
import log from '../../../utils/logger';
import SummaryNotesComponent from './SummaryNotesComponent';
import ChunkComparisonPanel from '../comparison/ChunkComparisonPanel';
import ChunkImagePanel from '../image/ChunkImagePanel';
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

    // Use selector to only subscribe to activeTabs and setActiveTabs
    const { activeTabs, setActiveTabs } = useChunkStore(state => ({
        activeTabs: state.activeTabs,
        setActiveTabs: state.setActiveTabs,
    }));

    // Determine the current active tab for this chunk (single-select behavior)
    const tabOptions: Array<'comparison' | 'ai-image'> = ['comparison', 'ai-image'];
    const activeTab = tabOptions.find(tab => activeTabs.includes(tab)) || 'comparison';
    const setActiveTab = (tab: 'comparison' | 'ai-image') => setActiveTabs([tab]);

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
            {/* Inline tab buttons */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, mt: 3, borderBottom: 1 }}>
                <Tooltip title="Show Comparison">
                    <span>
                        <IconButton
                            color={activeTab === 'comparison' ? 'primary' : 'default'}
                            aria-label="Show Comparison"
                            onClick={() => setActiveTab('comparison')}
                        >
                            <CompareArrowsIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Show AI Image">
                    <span>
                        <IconButton
                            color={activeTab === 'ai-image' ? 'primary' : 'default'}
                            aria-label="Show AI Image"
                            onClick={() => setActiveTab('ai-image')}
                        >
                            <PhotoFilterIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
            {/* Inline tab panels */}
            {activeTab === 'comparison' && (
                <ChunkComparisonPanel
                    chunkId={chunk.id}
                    comparisonText={chunk.comparison}
                    onComparisonUpdate={handleComparisonUpdate}
                />
            )}
            {activeTab === 'ai-image' && (
                <ChunkImagePanel
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

export default ChunkTools;
