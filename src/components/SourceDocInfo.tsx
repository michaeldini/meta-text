import React, { useState } from 'react';
import { Paper, Box, Typography, Divider, Stack, Chip, Alert } from '@mui/material';
import AiGenerationButton from './AiGenerationButton';
import { sourceDocInfoDetailsBox } from '../styles/pageStyles';
import type { SourceDocument } from '../types/sourceDocument';

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
            // TODO: Implement generateSourceDocInfo or use correct service function
            throw new Error('generateSourceDocInfo is not implemented.');
            // if (onInfoUpdate) onInfoUpdate();
        } catch (err: any) {
            setError(err.message || 'Failed to generate info');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={sourceDocInfoDetailsBox}>
                {Object.entries(FIELD_LABELS).map(([key, label]) => {
                    const value = (doc as any)[key];
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
                    const arr = splitToArray(value);
                    if (arr.length === 0) return null;
                    return (
                        <Stack key={key} direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Chip label={label} size="small" color="secondary" />
                            {arr.map((item, i) => (
                                <Chip key={i} label={item} size="small" color="primary" />
                            ))}
                        </Stack>
                    );
                })}
                <Divider sx={{ my: 2 }} />
                <AiGenerationButton
                    label="Generate Info"
                    toolTip="Generate or update document info using AI"
                    onClick={handleDownloadInfo}
                    loading={loading}
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Box>
        </Paper>
    );
};

export default SourceDocInfo;
