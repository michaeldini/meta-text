import React, { useState } from 'react';
import { Paper, Box, Typography, Divider, Stack, Chip, Alert } from '@mui/material';
import AiGenerationButton from '../../../components/AiGenerationButton';
import { getErrorMessage } from '../../../types/error';
import type { SourceDocument } from '../../../types/sourceDocument';
import { generateSourceDocInfo } from '../../../services/sourceDocInfoService';

interface SourceDocInfoProps {
    doc: SourceDocument;
    onInfoUpdate?: () => void;
}

const FIELD_LABELS: { [K in keyof SourceDocument]?: string } = {
    title: 'Title',
    author: 'Author',
    summary: 'Summary',
    characters: 'Characters',
    locations: 'Locations',
    themes: 'Themes',
    symbols: 'Symbols',
    text: 'Text',
};

function splitToArray(str?: string | null): string[] {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
}

const SourceDocInfo: React.FC<SourceDocInfoProps> = ({ doc, onInfoUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDownloadInfo = async () => {
        setLoading(true);
        setError('');
        try {
            const prompt = doc.text || '';
            if (!doc.id || !prompt) {
                throw new Error('Document ID or text is missing.');
            }
            const response = await generateSourceDocInfo({ id: doc.id, prompt });
            // Optionally update UI with new info, or trigger parent update
            if (onInfoUpdate) onInfoUpdate();
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to generate info'));
        } finally {
            setLoading(false);
        }
    };

    // Helper to render each field
    const renderField = (key: keyof SourceDocument, label: string) => {
        const value = doc[key];
        if (key === 'id' || value == null || value === '') return null;
        if (key === 'text') return null;
        if (key === 'summary') {
            return (
                <Box key={key} sx={{ mb: 1 }}>
                    <Typography variant="caption" color="secondary" sx={{ fontWeight: 600 }}>
                        {label}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.3 }}>
                        {value || 'N/A'}
                    </Typography>
                </Box>
            );
        }
        // Render comma-separated fields as chips
        const arr = splitToArray(value as string);
        if (arr.length === 0) return null;
        return (
            <Stack key={key} direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap' }}>
                <Chip
                    label={label}
                    size="small"
                    color="secondary"
                    sx={{ fontSize: '0.9rem', height: 24 }}
                />
                {arr.map((item, i) => (
                    <Chip
                        key={i}
                        label={item}
                        size="small"
                        color="primary"
                        sx={{ fontSize: '0.9rem', height: 24 }}
                    />
                ))}
            </Stack>
        );
    };

    return (
        <Paper sx={{ p: 1.5 }} elevation={2}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mb: 1.5
            }}>
                {Object.entries(FIELD_LABELS).map(([key, label]) =>
                    renderField(key as keyof SourceDocument, label!)
                )}
            </Box>
            <Divider sx={{ my: 1 }} />
            <AiGenerationButton
                label="Generate Info"
                toolTip="Generate or update document info using AI"
                onClick={handleDownloadInfo}
                loading={loading}
            />
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        </Paper >
    );
};

export default SourceDocInfo;
