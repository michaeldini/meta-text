import React, { memo } from 'react';
import { Box, TextField, Paper } from '@mui/material';
import SectionWords from './SectionWords';
import SectionAiSummary from './SectionAiSummary';

const MetaTextSection = memo(function MetaTextSection({
    section,
    sectionIdx,
    isLastSection,
    handleWordClick,
    handleRemoveSection,
    handleSectionFieldChange
}) {
    const words = section.content.split(/\s+/);
    const handleAISummaryUpdate = (newSummary) => handleSectionFieldChange(sectionIdx, 'aiSummary', newSummary);
    return (
        <Paper
            sx={{
                p: 4,
                borderRadius: 4,
                boxShadow: 3,
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': {
                    boxShadow: 8,
                    transform: 'scale(1.01)'
                },
                bgcolor: 'background.paper',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, bgcolor: 'background.default', borderRadius: 2, p: 2 }}>
                {/* Split text column */}
                <Box sx={{ flex: 2, minWidth: 0, p: 2 }}>
                    <SectionWords
                        words={words}
                        sectionIdx={sectionIdx}
                        handleWordClick={handleWordClick}
                        handleRemoveSection={handleRemoveSection}
                        isLastSection={isLastSection}
                    />
                </Box>
                {/* Details column */}
                <Box sx={{ flex: 1, minWidth: 220, maxWidth: 400, width: 350, display: 'flex', flexDirection: 'column', gap: 2, zIndex: 10 }}>
                    <TextField
                        label="Summary"
                        value={section.summary || ''}
                        onChange={e => handleSectionFieldChange(sectionIdx, 'summary', e.target.value)}
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
                        value={section.notes || ''}
                        onChange={e => handleSectionFieldChange(sectionIdx, 'notes', e.target.value)}
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
                        sectionContent={section.content}
                        aiSummary={section.aiSummary}
                        onAISummaryUpdate={handleAISummaryUpdate}
                    />
                </Box>
            </Box>
        </Paper>
    );
});

export default MetaTextSection;
