import React from 'react';
import { Box, useTheme, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMoreIcon } from 'icons';
import type { SourceDocument } from '../../../types/sourceDocument';
import { getSourceDocumentStyles } from '../styles/styles';

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

const SourceDocInfo: React.FC<SourceDocInfoProps> = ({ doc }) => {
    const theme = useTheme();
    const styles = getSourceDocumentStyles(theme);

    const renderField = (config: FieldConfig) => {
        const value = doc[config.key];
        if (!value) return null;

        // Handle list fields (comma-separated values)
        const listFields = ['characters', 'locations', 'themes', 'symbols'];
        if (listFields.includes(config.key)) {
            const arr = splitToArray(value as string);
            if (arr.length === 0) return null;
            return (
                <Accordion
                    key={config.key}
                    slotProps={{ transition: { unmountOnExit: true } }}
                    disableGutters={true}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">{config.label}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography >
                            {value as string}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            );
        }

        // Handle text fields (summary, author, etc.)
        return (
            <Accordion
                key={config.key}
                slotProps={{ transition: { unmountOnExit: true } }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{config.label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography >
                        {value as string}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        );
    };

    return (
        <Box sx={styles.container} data-testid="source-doc-info">
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Document Info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {FIELD_CONFIG.map(config => renderField(config))}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default SourceDocInfo;
