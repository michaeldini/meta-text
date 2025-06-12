import React, { useState } from 'react';
import { Box } from '@mui/material';

import AiGenerationButton from '../components/AiGenerationButton';
import { generateChunkNoteSummaryTextComparison } from '../services/aiService';

function ChunkComparison({ chunkId, comparisonText, onComparisonUpdate }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await generateChunkNoteSummaryTextComparison(chunkId);
            onComparisonUpdate(data.result || '');
        } catch {
            setError('Error generating summary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mt: 1, p: 1, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 1, bgcolor: theme => theme.palette.background.paper }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AiGenerationButton
                    label="What Did I Miss?"
                    loading={loading}
                    onClick={handleGenerate}
                    sx={{ ml: 1 }}
                    disabled={loading || !chunkId}
                    data-testid="generate-comparison-btn"
                    aria-label="Generate comparison summary"
                />
            </Box>
            <Box sx={{ whiteSpace: 'pre-line', minHeight: 24, color: theme => theme.palette.text.secondary }}>
                {comparisonText || <span style={{ color: '#aaa' }}>No summary yet.</span>}
            </Box>
            {error && <Box sx={{ color: 'error.main', fontSize: 12 }}>{error}</Box>}
        </Box>
    );
}

export default ChunkComparison;
