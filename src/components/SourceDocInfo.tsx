import React, { useEffect } from 'react';
import { Box, useTheme, Accordion, AccordionSummary, AccordionDetails, Typography, Alert } from '@mui/material';
import { ExpandMoreIcon } from 'icons';

import { splitToArray } from 'utils';
import { SourceDocumentDetail } from 'types';

interface SourceDocInfoProps {
    doc: SourceDocumentDetail;
}

// Configuration for rendering fields in the document info
interface FieldConfig {
    key: keyof import('types').SourceDocumentSummary;
    label: string;
    isListField?: boolean;
}
const FIELD_CONFIG: FieldConfig[] = [
    { key: 'author', label: 'Author' },
    { key: 'summary', label: 'Summary' },
    { key: 'characters', label: 'Characters', isListField: true },
    { key: 'locations', label: 'Locations', isListField: true },
    { key: 'themes', label: 'Themes', isListField: true },
    { key: 'symbols', label: 'Symbols', isListField: true },
];

const SourceDocInfo: React.FC<SourceDocInfoProps> = ({ doc }) => {

    const theme = useTheme();
    const containerStyles = {
        width: '100%',
        paddingX: theme.spacing(2),
    };


    // Render each field in the document info
    // Used in the render block below
    const renderField = (config: FieldConfig) => {
        if (!doc) return null;
        const value = doc[config.key];
        if (!value) return null;

        if (config.isListField) {
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
                        <Typography>
                            {arr.join(', ')}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            );
        }

        return (
            <Accordion
                key={config.key}
                slotProps={{ transition: { unmountOnExit: true } }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{config.label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {value as string}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        );
    };


    return (
        <Box sx={containerStyles} data-testid="source-doc-info">
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Document: {doc.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {FIELD_CONFIG.map(config => renderField(config))}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default SourceDocInfo;
