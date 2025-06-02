import React, { useState } from 'react';
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import aiIcon from '../assets/ai-stars.png';
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
        <Box sx={{ mt: 1, p: 1, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 1, bgcolor: theme => theme.palette.background.paper }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: theme => theme.palette.text.primary }}>
                <p>AI Summary:</p>
                <Tooltip title="Generate AI Summary">
                    <span>
                        <IconButton onClick={handleGenerate} disabled={loading} sx={{ ml: 1 }} size="small">
                            {loading ? <CircularProgress size={16} /> : <img src={aiIcon} alt="AI" style={{ width: 20, height: 20 }} />}
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
            <Box sx={{ whiteSpace: 'pre-line', minHeight: 24, color: theme => theme.palette.text.secondary }}>
                {aiSummary || <span style={{ color: '#aaa' }}>No summary yet.</span>}
            </Box>
            {error && <Box sx={{ color: 'error.main', fontSize: 12 }}>{error}</Box>}
        </Box>
    );
}

export default SectionAiSummary;
