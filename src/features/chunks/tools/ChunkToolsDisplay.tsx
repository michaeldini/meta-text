import React from 'react';
import { Box } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';
import NotesIcon from '@mui/icons-material/Notes';
import { useImageGeneration } from './image/useImageGeneration';
import log from '../../../utils/logger';
import SummaryNotesComponent from './summarynotes/SummaryNotesComponent';
import ChunkComparison from './comparison/ChunkComparison';
import ChunkImageDisplay from './image/Display';
import GenerateImageDialog from './image/Generate';
import { useImageGenerationDialog } from './image/useImageGenerationDialog';
import { useChunkStore } from '../../../store/chunkStore';
import type { Chunk } from '../../../types/chunk';
import { generateAiImage } from '../../../services/aiService';

interface ChunkToolsDisplayProps {
    chunk: Chunk;
    chunkIdx: number;
    handleChunkFieldChange: (chunkId: number, field: keyof Chunk, value: any) => void;
}

const tabOptions = [
    { value: 'notes-summary', icon: <NotesIcon />, key: 'notes-summary' },
    { value: 'comparison', icon: <CompareArrowsIcon />, key: 'comparison' },
    { value: 'ai-image', icon: <PhotoFilterIcon />, key: 'ai-image' },
] as const;

type TabType = typeof tabOptions[number]['value'];

const ChunkToolsDisplay: React.FC<ChunkToolsDisplayProps> = ({ chunk, chunkIdx, handleChunkFieldChange }) => {
    // Image state
    const { state: imageState, setState: setImageState, getImgSrc, openDialog } = useImageGeneration(chunk);
    const setLightboxOpen = (open: boolean) => setImageState(s => ({ ...s, lightboxOpen: open }));
    const setImageLoaded = (loaded: boolean) => setImageState(s => ({ ...s, loaded }));

    // Dialog state and handlers from custom hook
    const dialog = useImageGenerationDialog();

    // Dialog submit handler
    const handleDialogSubmit = async (prompt: string) => {
        dialog.setLoading(true);
        dialog.setError(null);
        try {
            const result = await generateAiImage(prompt, chunk.id);
            // Poll for image availability
            const pollImage = (url: string, timeout = 10000, interval = 300) =>
              new Promise<void>((resolve, reject) => {
                const start = Date.now();
                const check = () => {
                  const img = new window.Image();
                  img.onload = () => resolve();
                  img.onerror = () => {
                    if (Date.now() - start >= timeout) {
                      reject(new Error('Timed out waiting for image to be available'));
                    } else {
                      setTimeout(check, interval);
                    }
                  };
                  img.src = url + '?cacheBust=' + Date.now(); // prevent caching
                };
                check();
              });
            const imgUrl = `/${result.path}`;
            await pollImage(imgUrl, 10000, 300); // Poll every 300ms up to 10s
            setImageState(s => ({
                ...s,
                data: result.path,
                prompt: result.prompt,
                loading: false,
                error: null,
            }));
            dialog.closeDialog();
        } catch (err: any) {
            dialog.setError(err?.message || 'Failed to generate image');
            dialog.setLoading(false);
        }
    };

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
    const { updateChunkField } = useChunkStore();

    const handleComparisonUpdate = (newComparison: string) => updateChunkField(chunk.id, 'comparison', newComparison);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Show Notes/Summary if selected */}
            {activeTabs.includes('notes-summary') && (
                <SummaryNotesComponent
                    summary={chunk.summary}
                    notes={chunk.notes}
                    setSummary={val => updateChunkField(chunk.id, 'summary', val)}
                    setNotes={val => updateChunkField(chunk.id, 'notes', val)}
                    onSummaryBlur={() => { }}
                    onNotesBlur={() => { }}
                />
            )}
            {/* Show Comparison if selected */}
            {activeTabs.includes('comparison') && (
                <ChunkComparison
                    chunkId={chunk.id}
                    comparisonText={chunk.comparison}
                    onComparisonUpdate={handleComparisonUpdate}
                />
            )}
            {/* Show AI Image if selected */}
            {activeTabs.includes('ai-image') && (
                <>
                    <ChunkImageDisplay
                        imageState={imageState}
                        openDialog={dialog.openDialog}
                        getImgSrc={getImgSrc}
                        setImageLoaded={setImageLoaded}
                        setLightboxOpen={setLightboxOpen}
                        imgPrompt={imageState.prompt}
                    />
                    <GenerateImageDialog
                        open={dialog.dialogOpen}
                        onClose={dialog.closeDialog}
                        onSubmit={handleDialogSubmit}
                        loading={dialog.loading}
                        error={dialog.error}
                        prompt={dialog.prompt}
                        onPromptChange={dialog.handlePromptChange}
                    />
                </>
            )}
        </Box>
    );
};

export default ChunkToolsDisplay;
