import React, { memo } from 'react';
import { Box, Paper, LinearProgress, Button } from '@mui/material';
import ChunkWords from './ChunkWords';
import ChunkComparison from './ChunkComparison';
import GenerateImageDialog from '../components/GenerateImageDialog';
import ChunkImageDisplay from '../components/ChunkImageDisplay';
import { useDebouncedField } from '../hooks/useDebouncedField';
import { useImageGeneration } from '../hooks/useImageGeneration';
import ChunkTextField from '../components/ChunkTextField';
import GenerateImageButton from '../components/GenerateImageButton';

// Material UI sx style object for Chunk
const chunkStyles = {
    paper: {
        p: 1,
        borderRadius: 4,
        '&:hover': { backgroundColor: 'secondary.main' },
    },
    mainBox: {
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        bgcolor: 'background.default',
        borderRadius: 4,
        p: 2,
    },
    chunkTextBox: { flex: 2, minWidth: 0, p: 2 },
    chunkDetailsCol: {
        flex: 1,
        minWidth: 220,
        maxWidth: 400,
        width: 350,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        zIndex: 10,
    },
    textField: {
        borderRadius: 2,
        transition: 'box-shadow 0.2s, transform 0.2s',
        boxShadow: 0,
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'box-shadow 0.2s, transform 0.2s',
            boxShadow: 0,
            '&.Mui-focused': {
                boxShadow: 6,
                transform: 'scale(1.02)'
            }
        }
    },
    imageBtnBox: {
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2,
    },
    generateImageBtn: {
        borderRadius: 2,
        fontWeight: 600,
        fontSize: 16,
        minWidth: 160,
        minHeight: 40,
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'none',
    },
};

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
        getImgKey,
        openDialog,
        closeDialog,
        handleGenerate,
        setLightboxOpen,
        setImageLoaded,
    } = useImageGeneration(chunk);

    return (
        <Paper sx={chunkStyles.paper}>
            <Box sx={chunkStyles.mainBox}>
                {/* chunk text */}
                <Box sx={chunkStyles.chunkTextBox}>
                    <ChunkWords
                        words={words}
                        chunkIdx={chunkIdx}
                        handleWordClick={handleWordClick}
                        handleRemoveChunk={handleRemoveChunk}
                    />
                </Box>
                {/* Chunk details column */}
                <Box sx={chunkStyles.chunkDetailsCol}>
                    <ChunkTextField
                        label="Summary"
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                        onBlur={() => handleChunkFieldChange(chunkIdx, 'summary', summary)}
                        sx={chunkStyles.textField}
                    />
                    <ChunkTextField
                        label="Notes"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        onBlur={() => handleChunkFieldChange(chunkIdx, 'notes', notes)}
                        sx={chunkStyles.textField}
                    />
                    <ChunkComparison
                        chunkId={chunk.id}
                        comparisonText={chunk.comparison}
                        onComparisonUpdate={handleComparisonUpdate}
                    />
                    {/* Generate Image Button */}
                    <Box sx={chunkStyles.imageBtnBox}>
                        <GenerateImageButton
                            loading={imageState.loading}
                            onClick={openDialog}
                            disabled={imageState.loading}
                            sx={{ ...chunkStyles.generateImageBtn, opacity: imageState.loading ? 0.7 : 1 }}
                        />
                        {imageState.data && (
                            <ChunkImageDisplay
                                imgSrc={getImgSrc()}
                                imgKey={getImgKey()}
                                imgPrompt={imageState.prompt}
                                imgLoaded={imageState.loaded}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageLoaded(true)}
                                lightboxOpen={imageState.lightboxOpen}
                                setLightboxOpen={setLightboxOpen}
                                createdAt={chunk.ai_image && chunk.ai_image.created_at}
                                styles={chunkStyles}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
            <GenerateImageDialog
                open={imageState.dialogOpen}
                onClose={closeDialog}
                onSubmit={prompt => handleGenerate(prompt, chunk.id)}
                loading={imageState.loading}
                error={imageState.error}
            />
        </Paper>
    );
});

export default Chunk;
