import React, { useState } from 'react';
import { Box } from '@mui/material';
import AiStarsButton from '../components/AiStarsButton';

function ChunkAiSummary({ sectionContent, aiSummary, onAISummaryUpdate }) {
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
                <AiStarsButton
                    loading={loading}
                    onClick={handleGenerate}
                    label="Generate AI Summary"
                    size="small"
                    sx={{ ml: 1 }}
                />
            </Box>
            <Box sx={{ whiteSpace: 'pre-line', minHeight: 24, color: theme => theme.palette.text.secondary }}>
                {aiSummary || <span style={{ color: '#aaa' }}>No summary yet.</span>}
            </Box>
            {error && <Box sx={{ color: 'error.main', fontSize: 12 }}>{error}</Box>}
        </Box>
    );
}

export default ChunkAiSummary;
