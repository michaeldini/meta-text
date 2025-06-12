import React, { useState } from 'react';
import { Paper, Box, Typography, ListItem, Divider, Chip, Stack } from '@mui/material';

import AiGenerationButton from './AiGenerationButton';
import { generateSourceDocInfo } from '../services/sourceDocumentService';

// Helper to split comma-separated string into array, trimming whitespace
function splitToArray(str) {
    if (!str || typeof str !== 'string') return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
}

export default function SourceDocInfo({ doc, summaryError, onInfoUpdate }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handler for AI info download
    const handleDownloadInfo = async () => {
        setLoading(true);
        setError('');
        try {
            await generateSourceDocInfo(doc.id, doc.text);
            if (onInfoUpdate) onInfoUpdate(); // just trigger refetch
        } catch (e) {
            setError(e.message || 'Failed to download info');
        } finally {
            setLoading(false);
        }
    };

    // Prepare detail rows (excluding summary)
    const detailRows = [
        { key: 'characters', label: 'Characters', value: doc.characters },
        { key: 'locations', label: 'Locations', value: doc.locations },
        { key: 'themes', label: 'Themes', value: doc.themes },
        { key: 'symbols', label: 'Symbols', value: doc.symbols },
    ];

    return (
        <>
            <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
                {/* Summary row with AI info download button */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ p: 3, pl: 0, pr: 0, wordBreak: 'break-word', width: '100%', boxSizing: 'border-box' }}>
                        <strong>Summary:</strong> {doc.summary || 'No summary available.'}
                    </Typography>
                    <AiGenerationButton
                        label="Info"
                        toolTip="Use AI to generate info about this document"
                        loading={loading}
                        onClick={handleDownloadInfo}
                        data-testid="generate-source-doc-info-btn"
                        aria-label="Generate source doc info"
                        disabled={loading || !doc.text}
                    />
                </Box>
                {/* Details rows (dynamic) */}
                <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                    {detailRows.map(({ key, label, value }) => {
                        const arr = splitToArray(value);
                        if (arr.length === 0) return null;
                        return (
                            <Stack key={key} direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}><strong>{label}:</strong></Typography>
                                {arr.map((item, i) => (
                                    <Chip key={i} label={item} size="small" />
                                ))}
                            </Stack>
                        );
                    })}
                </Box>
                {summaryError && (
                    <ListItem>
                        <Typography color="error" variant="body2" sx={{ wordBreak: 'break-word', width: '100%' }}>{summaryError}</Typography>
                    </ListItem>
                )}
                {error && (
                    <ListItem>
                        <Typography color="error" variant="body2" sx={{ wordBreak: 'break-word', width: '100%' }}>{error}</Typography>
                    </ListItem>
                )}
            </Paper>
            <Divider />
        </>
    );
}
