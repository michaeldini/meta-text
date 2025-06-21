
import React from 'react';
import { Paper, Typography } from '@mui/material';
import { sourceDocContainerStyle } from '../styles';
import type { SourceDocument } from '../../../types/sourceDocument';

interface SourceDocProps {
    doc: SourceDocument;
}

/**
 * Component for displaying source document content
 */
export default function SourceDoc({ doc }: SourceDocProps) {
    return (
        <Paper sx={sourceDocContainerStyle} elevation={3}>
            <Typography variant="body2" aria-label="Document Text">
                {doc.text || 'No content available'}
            </Typography>
        </Paper>
    );
}