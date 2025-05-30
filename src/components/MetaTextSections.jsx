import React, { useState } from 'react';
import { Box, TextField, IconButton, Paper, Button, CircularProgress } from '@mui/material';
import UndoArrowIcon from './icons/UndoArrowIcon';

function AISummaryBox({ sectionContent, aiSummary, onAISummaryUpdate }) {
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

export default function MetaTextSections({ sections, handleWordClick, handleRemoveSection, handleSectionFieldChange }) {
    return (
        <Box>
            <Box>
                {sections.map((section, sectionIdx) => {
                    const words = section.content.split(/\s+/);
                    // Handler to update aiSummary in parent state
                    const handleAISummaryUpdate = (newSummary) => handleSectionFieldChange(sectionIdx, 'aiSummary', newSummary);
                    return (
                        <Paper key={sectionIdx} sx={{ p: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                                {/* Split text column */}
                                <Box sx={{ flex: 2, minWidth: 0 }}>
                                    <div>
                                        {words.map((word, wordIdx) => (
                                            <span
                                                key={wordIdx}
                                                onClick={() => handleWordClick(sectionIdx, wordIdx)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {word}{wordIdx < words.length - 1 && ' '}
                                                {/* Remove section button inline if not last section */}
                                                {wordIdx === words.length - 1 && sectionIdx < sections.length - 1 && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={e => { e.stopPropagation(); handleRemoveSection(sectionIdx); }}
                                                        title="Undo split (merge with next section)"
                                                        sx={{ ml: 1 }}
                                                    >
                                                        <UndoArrowIcon />
                                                    </IconButton>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </Box>
                                {/* Details column */}
                                <Box sx={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Summary"
                                        value={section.summary || ''}
                                        onChange={e => handleSectionFieldChange(sectionIdx, 'summary', e.target.value)}
                                        multiline
                                        minRows={2}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Notes"
                                        value={section.notes || ''}
                                        onChange={e => handleSectionFieldChange(sectionIdx, 'notes', e.target.value)}
                                        multiline
                                        minRows={2}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <AISummaryBox
                                        sectionContent={section.content}
                                        aiSummary={section.aiSummary}
                                        onAISummaryUpdate={handleAISummaryUpdate}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
}