import React, { memo, useState, useEffect } from 'react';
import { Box, TextField, Paper } from '@mui/material';
import ChunkWords from './ChunkWords';
import ChunkAiSummary from './ChunkAiSummary';

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
                </Box>
            </Box>
        </Paper>
    );
});

export default Chunk;
