import React, { memo, useState, useEffect } from 'react';
import { Box, TextField, Paper, LinearProgress, CircularProgress, Modal, Fade } from '@mui/material';
import ChunkWords from './ChunkWords';
import ChunkAiSummary from './ChunkAiSummary';
import GenerateImageDialog from '../components/GenerateImageDialog';
import { generateAiImage } from '../services/aiService';
import { fetchChunk } from '../services/chunkService';

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
    handleWordClick,
    handleRemoveChunk,
    handleChunkFieldChange
}) {
    const words = chunk.content ? chunk.content.split(/\s+/) : [];
    const handleAISummaryUpdate = (newSummary) => handleChunkFieldChange(chunkIdx, 'aiSummary', newSummary);

    // Local state for summary and notes for smooth typing
    const [summary, setSummary] = useState(chunk.summary || '');
    const [notes, setNotes] = useState(chunk.notes || '');

    // Image generation state
    const [imgDialogOpen, setImgDialogOpen] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const [imgError, setImgError] = useState(null);
    const [imgData, setImgData] = useState(null);
    const [imgPrompt, setImgPrompt] = useState('');
    const [imgLoaded, setImgLoaded] = useState(false);

    // Image lightbox state
    const [imgLightboxOpen, setImgLightboxOpen] = useState(false);

    // Keep local state in sync with chunk prop changes
    useEffect(() => {
        setSummary(chunk.summary || '');
    }, [chunk.summary]);
    useEffect(() => {
        setNotes(chunk.notes || '');
    }, [chunk.notes]);

    // Debounce save for summary
    useEffect(() => {
        const handler = setTimeout(() => {
            if (summary !== chunk.summary) {
                handleChunkFieldChange(chunkIdx, 'summary', summary);
            }
        }, 800);
        return () => clearTimeout(handler);
    }, [summary, chunk.summary, chunkIdx, handleChunkFieldChange]);

    // Debounce save for notes
    useEffect(() => {
        const handler = setTimeout(() => {
            if (notes !== chunk.notes) {
                handleChunkFieldChange(chunkIdx, 'notes', notes);
            }
        }, 800);
        return () => clearTimeout(handler);
    }, [notes, chunk.notes, chunkIdx, handleChunkFieldChange]);

    // Show image if chunk already has one (on mount or chunk change)
    useEffect(() => {
        if (chunk.ai_image && chunk.ai_image.path) {
            setImgData(chunk.ai_image.path);
            setImgPrompt(chunk.ai_image.prompt || '');
            // setImgLoaded(false); // moved to imgData effect below
        } else {
            setImgData(null);
            // setImgLoaded(false); // moved to imgData effect below
        }
    }, [chunk.ai_image]);

    // Reset imgLoaded whenever imgData changes
    useEffect(() => {
        setImgLoaded(false);
    }, [imgData]);

    const handleGenerateImageClick = () => {
        setImgDialogOpen(true);
        setImgError(null);
    };

    const handleImageDialogClose = () => {
        setImgDialogOpen(false);
        setImgError(null);
    };

    const handleImageGenerate = async (prompt) => {
        setImgLoading(true);
        setImgError(null);
        setImgPrompt(prompt);
        setImgDialogOpen(false); // Close dialog immediately on submit
        try {
            const result = await generateAiImage(prompt, chunk.id); // Pass chunk.id to associate image
            // Fetch updated chunk from backend to sync ai_image
            const updatedChunk = await fetchChunk(chunk.id);
            if (updatedChunk && updatedChunk.ai_image && updatedChunk.ai_image.path) {
                setImgData(updatedChunk.ai_image.path);
                setImgPrompt(updatedChunk.ai_image.prompt || '');
            } else {
                setImgData(result.path); // fallback
            }
        } catch (err) {
            setImgError(err?.message || 'Failed to generate image');
        } finally {
            setImgLoading(false);
        }
    };

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
                    <ChunkAiSummary
                        sectionContent={chunk.content}
                        aiSummary={chunk.aiSummary}
                        onAISummaryUpdate={handleAISummaryUpdate}
                    />
                    {/* Generate Image Button */}
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                        <button
                            style={{
                                background: '#1976d2',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '10px 20px',
                                fontWeight: 600,
                                fontSize: 16,
                                cursor: imgLoading ? 'wait' : 'pointer',
                                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                                transition: 'background 0.2s, box-shadow 0.2s',
                                opacity: imgLoading ? 0.7 : 1,
                                minWidth: 160,
                                minHeight: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onClick={handleGenerateImageClick}
                            disabled={imgLoading}
                        >
                            {imgLoading ? <LinearProgress sx={{ width: 120, color: '#fff' }} /> : 'Generate Image'}
                        </button>
                        {imgData && (
                            <>
                                <Box sx={{ mt: 2, width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee', borderRadius: 2, overflow: 'hidden', background: '#fafafa', position: 'relative', cursor: 'pointer' }}
                                    onClick={() => setImgLightboxOpen(true)}
                                    tabIndex={0}
                                    aria-label="Expand image"
                                >
                                    {!imgLoaded && (
                                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: 400, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, background: 'rgba(255,255,255,0.7)' }}>
                                            <CircularProgress size={48} />
                                        </Box>
                                    )}
                                    <img
                                        src={`/${imgData}`}
                                        alt={imgPrompt}
                                        style={{ width: 400, height: 400, objectFit: 'cover', display: imgLoaded ? 'block' : 'none' }}
                                        onLoad={() => setImgLoaded(true)}
                                        onError={() => setImgLoaded(true)}
                                    />
                                    {/* Show prompt and date if available */}
                                    <Box sx={{ mt: 1, width: '100%', textAlign: 'left', fontSize: 14, color: '#555', position: 'absolute', bottom: 0, left: 0, background: 'rgba(255,255,255,0.85)', p: 1 }}>
                                        {imgPrompt && <div><b>Prompt:</b> {imgPrompt}</div>}
                                        {chunk.ai_image && chunk.ai_image.created_at && (
                                            <div><b>Generated:</b> {new Date(chunk.ai_image.created_at).toLocaleString()}</div>
                                        )}
                                    </Box>
                                </Box>
                                {/* Lightbox Modal */}
                                <Modal
                                    open={imgLightboxOpen}
                                    onClose={() => setImgLightboxOpen(false)}
                                    closeAfterTransition
                                    aria-labelledby="image-lightbox-title"
                                    aria-describedby="image-lightbox-description"
                                >
                                    <Fade in={imgLightboxOpen}>
                                        <Box
                                            onClick={() => setImgLightboxOpen(false)}
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
                                                    src={`/${imgData}`}
                                                    alt={imgPrompt}
                                                    style={{
                                                        maxWidth: '80vw',
                                                        maxHeight: '70vh',
                                                        objectFit: 'contain',
                                                        borderRadius: 8,
                                                        background: '#fafafa',
                                                    }}
                                                />
                                                <Box sx={{ mt: 2, color: '#333', fontSize: 16, textAlign: 'center', width: '100%' }}>
                                                    {imgPrompt && <div><b>Prompt:</b> {imgPrompt}</div>}
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
                open={imgDialogOpen}
                onClose={handleImageDialogClose}
                onSubmit={handleImageGenerate}
                loading={false}
                error={imgError}
            />
        </Paper>
    );
});

export default Chunk;
