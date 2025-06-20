import React, { useState } from 'react';
import { Paper, Divider, Alert, List, ListItem, ListItemText, Collapse, ListItemButton, ListItemIcon, Box } from '@mui/material';
import { ExpandLess, ExpandMore } from '../../../components/icons';
import AiGenerationButton from '../../../components/AiGenerationButton';
import { getErrorMessage } from '../../../types/error';
import type { SourceDocument } from '../../../types/sourceDocument';
import { generateSourceDocInfo } from '../../../services/sourceDocInfoService';
import { slotPropsStyles } from '../styles/styles';

interface SourceDocInfoProps {
    doc: SourceDocument;
    onInfoUpdate?: () => void;
}

interface FieldConfig {
    key: keyof SourceDocument;
    label: string;
}

const FIELD_CONFIG: FieldConfig[] = [
    { key: 'author', label: 'Author' },
    { key: 'summary', label: 'Summary' },
    { key: 'characters', label: 'Characters' },
    { key: 'locations', label: 'Locations' },
    { key: 'themes', label: 'Themes' },
    { key: 'symbols', label: 'Symbols' },
];

function splitToArray(str?: string | null): string[] {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
}

const SourceDocInfo: React.FC<SourceDocInfoProps> = ({ doc, onInfoUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        summary: false,
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
            if (onInfoUpdate) onInfoUpdate();
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to generate info'));
        } finally {
            setLoading(false);
        }
    };

    const renderField = (config: FieldConfig) => {
        const value = doc[config.key];
        if (!value) return null;

        // Handle title field with special styling (non-collapsible)
        if (config.key === 'title') {
            return (
                <ListItem key={config.key} dense>
                    <ListItemText
                        primary={value as string}
                        slotProps={{
                            primary: slotPropsStyles.primaryTitle,
                        }}
                    />
                </ListItem>
            );
        }

        // Handle list fields (comma-separated values)
        const listFields = ['characters', 'locations', 'themes', 'symbols'];
        if (listFields.includes(config.key)) {
            const arr = splitToArray(value as string);
            if (arr.length === 0) return null;

            const isOpen = openSections[config.key];
            return (
                <React.Fragment key={config.key}>
                    <ListItemButton onClick={() => handleToggleSection(config.key)} dense>
                        <ListItemText
                            primary={config.label}
                            slotProps={{
                                primary: slotPropsStyles.primaryListItem,
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
                                            primary: slotPropsStyles.primaryListItemText,
                                        }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </React.Fragment>
            );
        }

        // Handle collapsible text fields (summary, author, etc.)
        const isOpen = openSections[config.key];
        return (
            <React.Fragment key={config.key}>
                <ListItemButton onClick={() => handleToggleSection(config.key)} dense>
                    <ListItemText
                        primary={config.label}
                        slotProps={{
                            primary: slotPropsStyles.primaryListItem,
                        }}
                    />
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                </ListItemButton>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <ListItem sx={{ pl: 4 }} dense>
                        <ListItemText
                            primary={value as string}
                            slotProps={{
                                primary: slotPropsStyles.primaryCollapsibleText,
                            }}
                        />
                    </ListItem>
                </Collapse>
            </React.Fragment>
        );
    };

    return (
        <Box>
            <List dense disablePadding >
                {FIELD_CONFIG.map(config => renderField(config))}
            </List>
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        </Box>
    );
};

export default SourceDocInfo;
