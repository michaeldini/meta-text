import React, { useState } from 'react';
import { Paper, Box, Typography, Divider, Stack, Chip, Alert, List, ListItem, ListItemText, Collapse, ListItemButton, ListItemIcon } from '@mui/material';
import { ExpandLess, ExpandMore } from '../../../components/icons';
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
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        characters: false,
        locations: false,
        themes: false,
        symbols: false
    });

    const handleToggleSection = (key: string) => {
        setOpenSections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

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

    // Separate fields into different categories
    const titleField = doc.title ? (
        <Box sx={{ mb: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {doc.title}
            </Typography>
        </Box>
    ) : null;

    const authorField = doc.author ? (
        <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="secondary" sx={{ fontWeight: 600 }}>
                Author
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.3 }}>
                {doc.author}
            </Typography>
        </Box>
    ) : null;

    const summaryField = doc.summary ? (
        <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="secondary" sx={{ fontWeight: 600 }}>
                Summary
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.3 }}>
                {doc.summary}
            </Typography>
        </Box>
    ) : null;

    // List fields
    const listFields = ['characters', 'locations', 'themes', 'symbols'].map(key => {
        const value = doc[key as keyof SourceDocument];
        const label = FIELD_LABELS[key as keyof SourceDocument];
        const arr = splitToArray(value as string);
        if (arr.length === 0) return null;

        const isOpen = openSections[key];

        return (
            <React.Fragment key={key}>
                <ListItemButton onClick={() => handleToggleSection(key)} dense>
                    <ListItemText
                        primary={label}
                        slotProps={{
                            primary: {
                                variant: 'caption',
                                color: 'secondary',
                                fontWeight: 600
                            }
                        }}
                    />
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                </ListItemButton>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {arr.map((item, i) => (
                            <ListItemButton key={i} sx={{ pl: 4 }} dense>
                                <ListItemText
                                    primary={item}
                                    slotProps={{
                                        primary: {
                                            variant: 'caption',
                                            sx: { lineHeight: 1.0 }
                                        }
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
            </React.Fragment>
        );
    }).filter(Boolean);

    return (
        <Paper sx={{ p: 1.5 }} elevation={2}>
            {/* Title at the top */}
            {titleField}

            {/* Two-column layout */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                mb: 1.5,
                minHeight: '100px'
            }}>
                {/* Left column - Summary and Author */}
                <Box>
                    {authorField}
                    {summaryField}
                </Box>

                {/* Right column - Lists */}
                <Box>
                    <List dense disablePadding>
                        {listFields}
                    </List>
                </Box>
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
