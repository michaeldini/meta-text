import React, { useState, memo } from 'react';
import { Box, TextField, IconButton, Paper, Button, CircularProgress, Divider } from '@mui/material';
import UndoArrowIcon from './icons/UndoArrowIcon';

function SectionAiSummary({ sectionContent, aiSummary, onAISummaryUpdate }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/ai-short-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: sectionContent })
            });
            if (!res.ok) throw new Error('Failed to generate summary');
            const data = await res.json();
            onAISummaryUpdate(data.result || '');
        } catch {
            setError('Error generating summary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5fa', borderRadius: 1, fontSize: 14, color: '#555' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <strong>AI Summary:</strong>
                <Button size="small" variant="outlined" onClick={handleGenerate} disabled={loading} sx={{ ml: 1 }}>
                    {loading ? <CircularProgress size={16} /> : 'Generate'}
                </Button>
            </Box>
            <Box sx={{ whiteSpace: 'pre-line', minHeight: 24 }}>{aiSummary || <span style={{ color: '#aaa' }}>No summary yet.</span>}</Box>
            {error && <Box sx={{ color: 'red', fontSize: 12 }}>{error}</Box>}
        </Box>
    );
}

// Memoized component for rendering clickable words in a section
const SectionWords = memo(function SectionWords({
    words,
    sectionIdx,
    handleWordClick,
    handleRemoveSection,
    isLastSection
}) {
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {words.map((word, wordIdx) => (
                <React.Fragment key={wordIdx}>
                    <Box
                        component="span"
                        onClick={() => handleWordClick(sectionIdx, wordIdx)}
                        sx={{
                            cursor: 'pointer',
                            borderRadius: 1,
                            transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
                            boxShadow: 0,
                            '&:hover': {
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                boxShadow: 2,
                                transform: 'scale(1.08)',
                                px: 1.2,
                            },
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: 16,
                            fontWeight: 500,
                            mr: wordIdx < words.length - 1 ? 0.5 : 0,
                            position: 'relative',
                        }}
                    >
                        {word}
                        {/* Remove section button inline if not last section */}
                        {wordIdx === words.length - 1 && !isLastSection && (
                            <IconButton
                                size="small"
                                onClick={e => { e.stopPropagation(); handleRemoveSection(sectionIdx); }}
                                title="Undo split (merge with next section)"
                                sx={{
                                    ml: 1,
                                    borderRadius: '50%',
                                    bgcolor: 'background.paper',
                                    boxShadow: 1,
                                    transition: 'box-shadow 0.2s, background 0.2s, transform 0.1s',
                                    '&:hover': {
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        boxShadow: 4,
                                        transform: 'rotate(-10deg) scale(1.1)'
                                    },
                                }}
                            >
                                <UndoArrowIcon />
                            </IconButton>
                        )}
                    </Box>
                </React.Fragment>
            ))}
        </Box>
    );
});

// Memoized component for a single section
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

export default function MetaTextSections({ sections, handleWordClick, handleRemoveSection, handleSectionFieldChange }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
            {sections.map((section, sectionIdx) => (
                <MetaTextSection
                    key={sectionIdx}
                    section={section}
                    sectionIdx={sectionIdx}
                    isLastSection={sectionIdx === sections.length - 1}
                    handleWordClick={handleWordClick}
                    handleRemoveSection={handleRemoveSection}
                    handleSectionFieldChange={handleSectionFieldChange}
                />
            ))}
        </Box>
    );
}