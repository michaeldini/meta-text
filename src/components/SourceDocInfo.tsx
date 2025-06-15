import React, { useState } from 'react';
import { Paper, Box, Typography, ListItem, Divider, Chip, Stack } from '@mui/material';
import AiGenerationButton from './AiGenerationButton';
import { sourceDocInfoDetailsBox } from '../styles/pageStyles';

interface SourceDocInfoProps {
    doc: { id: string | number; text: string;[key: string]: any };
    onInfoUpdate?: () => void;
}

function splitToArray(str: string): string[] {
    if (!str || typeof str !== 'string') return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
}

function renderDetailRow({ key, label, value }: { key: string; label: string; value: string; }) {
    if (label === 'Summary') {
        return (
            <Stack key={key} direction="row" spacing={2} alignItems="center">
                <Chip label={label} size="medium" sx={{ fontWeight: 'bold' }} variant="outlined" color="secondary" />
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
            <Chip label={label} size="medium" sx={{ fontWeight: 'bold', p: 2 }} variant="outlined" color="secondary" />
            {arr.map((item, i) => (
                <Chip key={i} label={item} size="small" sx={{ p: 1 }} variant="outlined" color="primary" />
            ))}
        </Stack>
    );
}

const SourceDocInfo: React.FC<SourceDocInfoProps> = ({ doc, onInfoUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDownloadInfo = async () => {
        setLoading(true);
        setError('');
        try {
            // TODO: Implement generateSourceDocInfo or use correct service function
            // await generateSourceDocInfo(doc.id, doc.text);
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
            {/* Render details and AI generation button here */}
        </Paper>
    );
};

export default SourceDocInfo;
