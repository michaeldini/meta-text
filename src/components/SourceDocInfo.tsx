import React, { useState } from 'react';
import { Paper, Box, Typography, Divider, Stack, Chip, Alert } from '@mui/material';
import AiGenerationButton from './AiGenerationButton';
import { sourceDocInfoDetailsBox } from '../styles/pageStyles';
import type { SourceDocument } from '../types/sourceDocument';
import { generateSourceDocInfo } from '../services/sourceDocInfoService';

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
        } catch (err: any) {
            setError(err.message || 'Failed to generate info');
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
                <Box key={key} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="secondary">{label}</Typography>
                    <Typography variant="body1">{value || 'N/A'}</Typography>
                </Box>
            );
        }
        // Render comma-separated fields as chips
        const arr = splitToArray(value as string);
        if (arr.length === 0) return null;
        return (
            <Stack key={key} direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Chip label={label} size="small" color="secondary" />
                {arr.map((item, i) => (
                    <Chip key={i} label={item} size="small" color="primary" />
                ))}
            </Stack>
        );
    };

    return (
        <Paper sx={sourceDocInfoDetailsBox} elevation={3}>
            <Box>
                {Object.entries(FIELD_LABELS).map(([key, label]) =>
                    renderField(key as keyof SourceDocument, label!)
                )}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <AiGenerationButton
                    label="Generate Info"
                    toolTip="Generate or update document info using AI"
                    onClick={handleDownloadInfo}
                    loading={loading}
                />
                {error && <Alert severity="error">{error}</Alert>}
            </Box>
        </Paper>
    );
};

export default SourceDocInfo;
