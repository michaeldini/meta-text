import React from 'react';
import { Paper, Typography, useTheme } from '@mui/material';
import { getSourceDocumentStyles } from '../styles/styles';
import type { SourceDocument } from '../../../types/sourceDocument';

interface SourceDocProps {
    doc: SourceDocument;
}

/**
 * Component for displaying source document content
 */
export default function SourceDoc({ doc }: SourceDocProps) {
    const theme = useTheme();
    const styles = getSourceDocumentStyles(theme);
    return (
        <Paper sx={styles.container} elevation={3}>
            <Typography variant="body2" aria-label="Document Text">
                {doc.text || 'No content available'}
            </Typography>
        </Paper>
    );
}