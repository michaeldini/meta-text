import React, { memo } from 'react';
import { Box, TextField, Paper, LinearProgress, CircularProgress, Modal, Fade, Button } from '@mui/material';
import ChunkWords from './ChunkWords';
import ChunkComparison from './ChunkComparison';
import GenerateImageDialog from '../components/GenerateImageDialog';
import { useDebouncedField } from '../hooks/useDebouncedField';
import { useImageGeneration } from '../hooks/useImageGeneration';

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
        <Paper
            sx={{
                p: 1,
                borderRadius: 4,
                '&:hover': {
                    backgroundColor: 'secondary.main',
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, bgcolor: 'background.default', borderRadius: 4, p: 2 }}>
                {/* chunk text */}
                <Box sx={{ flex: 2, minWidth: 0, p: 2 }}>
                    <ChunkWords
                        words={words}
                        chunkIdx={chunkIdx}
                        handleWordClick={handleWordClick}
                        handleRemoveChunk={handleRemoveChunk}
                    />
                </Box>
                {/* Chunk details column */}
                <Box sx={{ flex: 1, minWidth: 220, maxWidth: 400, width: 350, display: 'flex', flexDirection: 'column', gap: 2, zIndex: 10 }}>
                    <TextField
                        label="Summary"
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                        onBlur={() => handleChunkFieldChange(chunkIdx, 'summary', summary)}
                        multiline
                        minRows={2}
                        variant="outlined"
                        fullWidth
                        sx={{
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
                        }}
                    />
                    <TextField
                        label="Notes"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        onBlur={() => handleChunkFieldChange(chunkIdx, 'notes', notes)}
                        multiline
                        minRows={2}
                        variant="outlined"
                        fullWidth
                        sx={{
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
                        }}
                    />
                    <ChunkComparison
                        chunkId={chunk.id}
                        comparisonText={chunk.comparison}
                        onComparisonUpdate={handleComparisonUpdate}
                    />
                    {/* Generate Image Button */}
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                fontSize: 16,
                                minWidth: 160,
                                minHeight: 40,
                                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                                opacity: imageState.loading ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textTransform: 'none',
                            }}
                            onClick={openDialog}
                            disabled={imageState.loading}
                        >
                            {imageState.loading ? <LinearProgress sx={{ width: 120, color: '#fff' }} /> : 'Generate Image'}
                        </Button>
                        {imageState.data && (
                            <>
                                <Box sx={{ mt: 2, width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee', borderRadius: 2, overflow: 'hidden', background: '#fafafa', position: 'relative', cursor: 'pointer' }}
                                    onClick={() => setLightboxOpen(true)}
                                    tabIndex={0}
                                    aria-label="Expand image"
                                >
                                    {!imageState.loaded && (
                                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: 400, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, background: 'rgba(255,255,255,0.7)' }}>
                                            <CircularProgress size={48} />
                                        </Box>
                                    )}
                                    <img
                                        src={getImgSrc()}
                                        key={getImgKey()}
                                        alt={imageState.prompt}
                                        style={{ width: 400, height: 400, objectFit: 'cover', display: imageState.loaded ? 'block' : 'none' }}
                                        onLoad={() => setImageLoaded(true)}
                                        onError={() => setImageLoaded(true)}
                                    />
                                    {/* Show prompt and date if available */}
                                    <Box sx={{ mt: 1, width: '100%', textAlign: 'left', fontSize: 14, color: '#555', position: 'absolute', bottom: 0, left: 0, background: 'rgba(255,255,255,0.85)', p: 1 }}>
                                        {imageState.prompt && <div><b>Prompt:</b> {imageState.prompt}</div>}
                                        {chunk.ai_image && chunk.ai_image.created_at && (
                                            <div><b>Generated:</b> {new Date(chunk.ai_image.created_at).toLocaleString()}</div>
                                        )}
                                    </Box>
                                </Box>
                                {/* Lightbox Modal */}
                                <Modal
                                    open={imageState.lightboxOpen}
                                    onClose={() => setLightboxOpen(false)}
                                    closeAfterTransition
                                    aria-labelledby="image-lightbox-title"
                                    aria-describedby="image-lightbox-description"
                                >
                                    <Fade in={imageState.lightboxOpen}>
                                        <Box
                                            onClick={() => setLightboxOpen(false)}
                                            sx={{
                                                position: 'fixed',
                                                top: 0,
                                                left: 0,
                                                width: '100vw',
                                                height: '100vh',
                                                bgcolor: 'rgba(0,0,0,0.85)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 2000,
                                                cursor: 'zoom-out',
                                            }}
                                        >
                                            <Box
                                                onClick={e => e.stopPropagation()}
                                                sx={{
                                                    outline: 'none',
                                                    boxShadow: 8,
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    bgcolor: '#fff',
                                                    p: 2,
                                                    maxWidth: '90vw',
                                                    maxHeight: '90vh',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <img
                                                    src={getImgSrc()}
                                                    key={getImgKey()}
                                                    alt={imageState.prompt}
                                                    style={{
                                                        maxWidth: '80vw',
                                                        maxHeight: '70vh',
                                                        objectFit: 'contain',
                                                        borderRadius: 8,
                                                        background: '#fafafa',
                                                    }}
                                                />
                                                <Box sx={{ mt: 2, color: '#333', fontSize: 16, textAlign: 'center', width: '100%' }}>
                                                    {imageState.prompt && <div><b>Prompt:</b> {imageState.prompt}</div>}
                                                    {chunk.ai_image && chunk.ai_image.created_at && (
                                                        <div><b>Generated:</b> {new Date(chunk.ai_image.created_at).toLocaleString()}</div>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Fade>
                                </Modal>
                            </>
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
