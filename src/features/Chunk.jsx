import React, { memo } from 'react';
import { Box, Paper } from '@mui/material';
import ChunkWords from './ChunkWords';
import ChunkComparison from './ChunkComparison';
import GenerateImageDialog from '../components/GenerateImageDialog';
import ChunkImageDisplay from '../components/ChunkImageDisplay';
import { useDebouncedField } from '../hooks/useDebouncedField';
import { useImageGeneration } from '../hooks/useImageGeneration';
import ChunkTextField from '../components/ChunkTextField';
import AiGenerationButton from '../components/AiGenerationButton';
import {
    chunkPaper,
    chunkMainBox,
    chunkTextBox,
    chunkDetailsCol,
    chunkTextField,
    chunkImageBtnBox,
    AiGenerationBtn
} from '../styles/pageStyles';
import log from '../utils/logger';

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
    handleWordClick,
    handleRemoveChunk,
    handleChunkFieldChange
}) {
    const words = chunk.content ? chunk.content.split(/\s+/) : [];
    const handleComparisonUpdate = (newComparison) => handleChunkFieldChange(chunkIdx, 'comparison', newComparison);

    // Debounced fields
    const [summary, setSummary] = useDebouncedField(
        chunk.summary || '',
        (val) => handleChunkFieldChange(chunkIdx, 'summary', val),
        800
    );
    const [notes, setNotes] = useDebouncedField(
        chunk.notes || '',
        (val) => handleChunkFieldChange(chunkIdx, 'notes', val),
        800
    );

    // Image state
    const {
        imageState,
        getImgSrc,
        openDialog,
        closeDialog,
        handleGenerate,
        setLightboxOpen,
        setImageLoaded,
    } = useImageGeneration(chunk);

    // Log mount/unmount
    React.useEffect(() => {
        log.info(`Chunk component mounted (id: ${chunk.id})`);
        return () => log.info(`Chunk component unmounted (id: ${chunk.id})`);
    }, [chunk.id]);

    // Log image generation events
    React.useEffect(() => {
        if (imageState.loading) log.info(`Image generation started for chunk id: ${chunk.id}`);
        if (imageState.error) log.error(`Image generation error for chunk id: ${chunk.id}:`, imageState.error);
        if (imageState.data) log.info(`Image retrieved for chunk id: ${chunk.id}`);
    }, [imageState.loading, imageState.error, imageState.data, chunk.id]);

    return (
        <Paper sx={chunkPaper}>
            <Box sx={chunkMainBox}>
                {/* chunk text */}
                <Box sx={chunkTextBox}>
                    <ChunkWords
                        words={words}
                        chunkIdx={chunkIdx}
                        handleWordClick={handleWordClick}
                        handleRemoveChunk={handleRemoveChunk}
                        chunk={chunk}
                    />
                </Box>
                {/* Chunk details column */}
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
                    <ChunkComparison
                        chunkId={chunk.id}
                        comparisonText={chunk.comparison}
                        onComparisonUpdate={handleComparisonUpdate}
                    />

                    <AiGenerationButton
                        label="Generate Image"
                        loading={imageState.loading}
                        onClick={openDialog}
                        disabled={imageState.loading}
                        sx={{ ...AiGenerationBtn, opacity: imageState.loading ? 0.7 : 1 }}
                        data-testid={`generate-image-btn-${chunk.id}`}
                        aria-label={`Generate image for chunk ${chunk.id}`}
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
                            styles={{
                                paper: chunkPaper,
                                mainBox: chunkMainBox,
                                chunkTextBox,
                                chunkDetailsCol,
                                textField: chunkTextField,
                                imageBtnBox: chunkImageBtnBox,
                                generateImageBtn: AiGenerationBtn
                            }}
                        />
                    )}
                </Box>
                <GenerateImageDialog
                    open={imageState.dialogOpen}
                    onClose={closeDialog}
                    onSubmit={prompt => handleGenerate(prompt, chunk.id)}
                    loading={imageState.loading}
                    error={imageState.error}
                />
            </Box>
        </Paper>
    );
});

export default Chunk;
