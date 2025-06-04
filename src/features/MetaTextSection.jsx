import React, { memo } from 'react';
import { Box, TextField, Paper } from '@mui/material';
import ChunkWords from './ChunkWords';
import SectionAiSummary from '../features/SectionAiSummary';

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
    handleWordClick,
    handleRemoveChunk,
    handleChunkFieldChange
}) {
    const words = chunk.content ? chunk.content.split(/\s+/) : [];
    const handleAISummaryUpdate = (newSummary) => handleChunkFieldChange(chunkIdx, 'aiSummary', newSummary);
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
                {/* Split text column */}
                <Box sx={{ flex: 2, minWidth: 0, p: 2 }}>
                    <ChunkWords
                        words={words}
                        chunkIdx={chunkIdx}
                        handleWordClick={handleWordClick}
                        handleRemoveChunk={handleRemoveChunk}
                    />
                </Box>
                {/* Details column */}
                <Box sx={{ flex: 1, minWidth: 220, maxWidth: 400, width: 350, display: 'flex', flexDirection: 'column', gap: 2, zIndex: 10 }}>
                    <TextField
                        label="Summary"
                        value={chunk.summary || ''}
                        onChange={e => handleChunkFieldChange(chunkIdx, 'summary', e.target.value)}
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
                        value={chunk.notes || ''}
                        onChange={e => handleChunkFieldChange(chunkIdx, 'notes', e.target.value)}
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
                    <SectionAiSummary
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
