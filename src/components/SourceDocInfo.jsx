import React, { useState } from 'react';
import { Paper, Box, Typography, ListItem, Divider, Chip, Stack } from '@mui/material';

import AiGenerationButton from './AiGenerationButton';
import { generateSourceDocInfo } from '../services/sourceDocumentService';
import { sourceDocInfoDetailsBox } from '../styles/pageStyles';

// Helper to split comma-separated string into array, trimming whitespace
function splitToArray(str) {
    if (!str || typeof str !== 'string') return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
}

// Helper to render a detail row
function renderDetailRow({ key, label, value }) {
    if (label === 'Summary') {
        return (
            <Stack key={key} direction="row" spacing={2} alignItems="center">
                <Chip label={label} size="medium"
                    sx={{ fontWeight: 'bold' }}
                    variant="outlined"
                    color="secondary"
                />
                <Typography>
                    {value || 'No summary available.'}
                </Typography>
            </Stack>
        );
    }
    const arr = splitToArray(value);
    if (arr.length === 0) return null;
    return (
        <Stack key={key} direction="row" spacing={2} alignItems="center">
            <Chip label={label} size="medium"
                sx={{ fontWeight: 'bold', p: 2 }}
                variant="outlined"
                color="secondary"
            />
            {arr.map((item, i) => (
                <Chip key={i} label={item} size="small"
                    sx={{ p: 1 }}
                    variant="outlined"
                    color="primary"
                />
            ))}
        </Stack>
    );
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
        { key: 'title', label: 'Title', value: doc.title },
        { key: 'characters', label: 'Characters', value: doc.characters },
        { key: 'locations', label: 'Locations', value: doc.locations },
        { key: 'themes', label: 'Themes', value: doc.themes },
        { key: 'symbols', label: 'Symbols', value: doc.symbols },
        { key: 'summary', label: 'Summary', value: doc.summary },
    ];

    return (
        <>
            <Box sx={{
                alignItems: 'start',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'secondary.main',
                textAlign: 'left',
            }}>
                <AiGenerationButton
                    label="Info"
                    toolTip="Use AI to generate info about this document"
                    loading={loading}
                    onClick={handleDownloadInfo}
                    disabled={loading || !doc.text}
                />
                <Divider sx={{ width: '100%', my: 2 }} />
                <Box sx={sourceDocInfoDetailsBox}>
                    {detailRows.map(renderDetailRow)}
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
            </Box >
        </>
    );
}
