import React, { memo, useState } from 'react';
import { Box, Paper } from '@mui/material';
import ChunkWords from './ChunkWords';
import ChunkComparison from './ChunkComparison';
import GenerateImageDialog from '../../components/GenerateImageDialog';
import ChunkImageDisplay from './ChunkImageDisplay';
import { useDebouncedField } from '../../hooks/useDebouncedField';
import { useImageGeneration } from '../../hooks/useImageGeneration';
import ChunkTextField from './ChunkTextField';
import AiGenerationButton from '../../components/AiGenerationButton';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';
import {
    chunkMainBox,
    chunkTextBox,
    chunkDetailsCol,
    chunkTextField,
    // chunkImageBtnBox,
    toolStyles
} from './Chunks.styles';
import log from '../../utils/logger';
import ToolIconButton from './ToolIconButton';
import { AiGenerationBtn } from '../../components/AiGenerationBtn';

export interface ChunkProps {
    chunk: any;
    chunkIdx: number;
    handleWordClick: (chunkIdx: number, wordIdx: number) => void;
    handleRemoveChunk: (chunkIdx: number) => void;
    handleChunkFieldChange: (chunkIdx: number, field: string, value: any) => void;
}

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
    handleWordClick,
    handleRemoveChunk,
    handleChunkFieldChange
}: ChunkProps) {
    const words = chunk.content ? chunk.content.split(/\s+/) : [];
    const handleComparisonUpdate = (newComparison: string) => handleChunkFieldChange(chunkIdx, 'comparison', newComparison);

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

    // Provide local wrappers for missing methods
    const closeDialog = () => setImageState(s => ({ ...s, dialogOpen: false }));
    const handleGenerate = (prompt: string, chunkId: number) => {
        // You may want to implement this logic or call a service
        // For now, just close the dialog
        setImageState(s => ({ ...s, dialogOpen: false }));
    };
    const setLightboxOpen = (open: boolean) => setImageState(s => ({ ...s, lightboxOpen: open }));
    const setImageLoaded = (loaded: boolean) => setImageState(s => ({ ...s, loaded }));

    React.useEffect(() => {
        log.info(`Chunk component mounted (id: ${chunk.id})`);
        return () => log.info(`Chunk component unmounted (id: ${chunk.id})`);
    }, [chunk.id]);

    React.useEffect(() => {
        if (imageState.loading) log.info(`Image generation started for chunk id: ${chunk.id}`);
        if (imageState.error) log.error(`Image generation error for chunk id: ${chunk.id}:`, imageState.error);
        if (imageState.data) log.info(`Image retrieved for chunk id: ${chunk.id}`);
    }, [imageState.loading, imageState.error, imageState.data, chunk.id]);

    const [activeTab, setActiveTab] = useState<'comparison' | 'ai-image'>('comparison');

    return (
        <Paper elevation={3} sx={chunkMainBox}>
            <Box sx={chunkTextBox}>
                <ChunkWords
                    words={words}
                    chunkIdx={chunkIdx}
                    handleWordClick={handleWordClick}
                    handleRemoveChunk={handleRemoveChunk}
                    chunk={chunk}
                />
            </Box>
            <Box sx={chunkDetailsCol}>
                <ChunkTextField
                    label="Summary"
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                    onBlur={() => handleChunkFieldChange(chunkIdx, 'summary', summary)}
                    sx={chunkTextField}
                />
                <ChunkTextField
                    label="Notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    onBlur={() => handleChunkFieldChange(chunkIdx, 'notes', notes)}
                    sx={chunkTextField}
                />
                <Box sx={{ display: 'flex', gap: 1, mb: 1, borderBottom: 1 }}>
                    <ToolIconButton
                        title="Show Comparison"
                        icon={<CompareArrowsIcon />}
                        color={activeTab === 'comparison' ? 'primary' : 'default'}
                        ariaLabel="Show Comparison"
                        onClick={() => setActiveTab('comparison')}
                    />
                    <ToolIconButton
                        title="Show AI Image"
                        icon={<PhotoFilterIcon />}
                        color={activeTab === 'ai-image' ? 'primary' : 'default'}
                        ariaLabel="Show AI Image"
                        onClick={() => setActiveTab('ai-image')}
                    />
                </Box>
                {activeTab === 'comparison' && (
                    <ChunkComparison
                        chunkId={chunk.id}
                        comparisonText={chunk.comparison}
                        onComparisonUpdate={handleComparisonUpdate}
                    />
                )}
                {activeTab === 'ai-image' && (
                    <Paper sx={toolStyles}>
                        <AiGenerationButton
                            label="Generate Image"
                            toolTip="Generate an image for this chunk using AI"
                            loading={imageState.loading}
                            onClick={openDialog}
                            disabled={imageState.loading}
                            sx={{ ...AiGenerationBtn, opacity: imageState.loading ? 0.7 : 1 }}
                        />
                        {imageState.data && (
                            <ChunkImageDisplay
                                imgSrc={getImgSrc()}
                                imgPrompt={imageState.prompt}
                                imgLoaded={imageState.loaded}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageLoaded(true)}
                                lightboxOpen={imageState.lightboxOpen}
                                setLightboxOpen={setLightboxOpen}
                                createdAt={chunk.ai_image && chunk.ai_image.created_at}
                            />
                        )}
                    </Paper>
                )}
                {/* <GenerateImageDialog
                    open={imageState.dialogOpen}
                    onClose={closeDialog}
                    onSubmit={prompt => handleGenerate(prompt, chunk.id)}
                    loading={imageState.loading}
                    error={imageState.error}
                /> */}
            </Box>
        </Paper>
    );
});

export default Chunk;
