import React, { useEffect } from 'react';
import { Box, useTheme, Accordion, AccordionSummary, AccordionDetails, Typography, Alert } from '@mui/material';
import { ExpandMoreIcon } from 'icons';

import { useDocumentsStore } from 'store/documentsStore';
import { LoadingSpinner } from 'components';

interface SourceDocInfoProps {
    sourceDocumentId: number;
    onInfoUpdate?: () => void;
}

interface FieldConfig {
    key: keyof import('types').SourceDocumentSummary;
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

const SourceDocInfo: React.FC<SourceDocInfoProps> = ({ sourceDocumentId }) => {
    const theme = useTheme();

    const sourceDocs = useDocumentsStore(s => s.sourceDocs);
    const loading = useDocumentsStore(s => s.sourceDocsLoading);
    const error = useDocumentsStore(s => s.sourceDocsError);
    const fetchSourceDocs = useDocumentsStore(s => s.fetchSourceDocs);
    const doc = sourceDocs.find(d => d.id === sourceDocumentId);

    useEffect(() => {
        fetchSourceDocs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceDocumentId]);

    const renderField = (config: FieldConfig) => {
        if (!doc) return null;
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

    if (loading) {
        return <LoadingSpinner />;
    }
    if (error) {
        return <Box><Alert severity="error">{error}</Alert></Box>;
    }
    if (!doc) {
        return <Box><Alert severity="warning">Document not found.</Alert></Box>;
    }

    return (
        <Box sx={{
            width: '100%',
            paddingX: theme.spacing(2),
        }} data-testid="source-doc-info">
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
