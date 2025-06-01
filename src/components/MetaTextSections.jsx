import React, { useState, memo, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Button, CircularProgress, Divider } from '@mui/material';
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

// Memoized component for rendering clickable words in a section
const SectionWords = memo(function SectionWords({
    words,
    sectionIdx,
    handleWordClick,
    handleRemoveSection,
    isLastSection,
    splitting,
    splitAnim
}) {
    // For animation
    const [grow, setGrow] = useState(0);
    const animRef = useRef();

    useEffect(() => {
        if (splitting && splitAnim && splitting.sectionIdx === sectionIdx) {
            setGrow(0);
            let start;
            function animate(ts) {
                if (!start) start = ts;
                const elapsed = ts - start;
                const percent = Math.min(elapsed / 2000, 1);
                setGrow(percent);
                if (percent < 1) {
                    animRef.current = requestAnimationFrame(animate);
                }
            }
            animRef.current = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(animRef.current);
        } else {
            setGrow(0);
        }
    }, [splitting, splitAnim, sectionIdx]);

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {words.map((word, wordIdx) => (
                <React.Fragment key={wordIdx}>
                    <Box
                        component="span"
                        onClick={() => !splitting && handleWordClick(sectionIdx, wordIdx)}
                        sx={{
                            cursor: splitting ? 'default' : 'pointer',
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
                    {/* Animated split element */}
                    {splitting && splitAnim && splitting.wordIdx === wordIdx && splitting.sectionIdx === sectionIdx && (
                        <Box
                            sx={{
                                display: 'inline-block',
                                width: `${16 + 64 * grow}px`,
                                height: `${16 + 32 * grow}px`,
                                mx: 1,
                                borderRadius: 2,
                                bgcolor: 'primary.main',
                                boxShadow: 4,
                                transition: 'width 0.2s, height 0.2s',
                                verticalAlign: 'middle',
                                opacity: 0.7,
                            }}
                        />
                    )}
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
    handleSectionFieldChange,
    splitting,
    splitAnim
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
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                {/* Split text column */}
                <Box sx={{ flex: 2, minWidth: 0, p: 2 }}>
                    <SectionWords
                        words={words}
                        sectionIdx={sectionIdx}
                        handleWordClick={handleWordClick}
                        handleRemoveSection={handleRemoveSection}
                        isLastSection={isLastSection}
                        splitting={splitting}
                        splitAnim={splitAnim}
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
                    <AISummaryBox
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

    // Track which section/word is being split animatedly
    const [splitting, setSplitting] = useState(null); // { sectionIdx, wordIdx } or null
    const [splitAnim, setSplitAnim] = useState(false);

    // Handler for word click with animation
    const handleWordClickWithAnim = (sectionIdx, wordIdx) => {
        setSplitting({ sectionIdx, wordIdx });
        setSplitAnim(true);
    };

    // Effect to run the animation and trigger split after 2s
    useEffect(() => {
        if (splitting && splitAnim) {
            const timer = setTimeout(() => {
                handleWordClick(splitting.sectionIdx, splitting.wordIdx);
                setSplitting(null);
                setSplitAnim(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [splitting, splitAnim, handleWordClick]);

    return (
        <Box >
            {sections.map((section, sectionIdx) => (
                <MetaTextSection
                    key={sectionIdx}
                    section={section}
                    sectionIdx={sectionIdx}
                    isLastSection={sectionIdx === sections.length - 1}
                    handleWordClick={handleWordClickWithAnim}
                    handleRemoveSection={handleRemoveSection}
                    handleSectionFieldChange={handleSectionFieldChange}
                    splitting={splitting && splitting.sectionIdx === sectionIdx ? splitting : null}
                    splitAnim={splitAnim}
                />
            ))}
        </Box>
    );
}