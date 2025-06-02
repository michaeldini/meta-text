import React, { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

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

export default SectionAiSummary;
