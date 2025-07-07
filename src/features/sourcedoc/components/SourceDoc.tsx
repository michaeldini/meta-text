import React from 'react';
import { Paper, Typography, useTheme } from '@mui/material';
import { getSourceDocumentStyles } from '../styles/styles';
import type { SourceDocumentDetail } from 'types';
import { useUIPreferencesStore } from 'store';

interface SourceDocProps {
    doc: SourceDocumentDetail;
}


/**
 * Component for displaying source document content
 */
export default function SourceDoc({ doc }: SourceDocProps) {
    const theme = useTheme();
    const styles = getSourceDocumentStyles(theme);

    const textSizePx = useUIPreferencesStore(state => state.textSizePx);
    const fontFamily = useUIPreferencesStore(state => state.fontFamily);
    const lineHeight = useUIPreferencesStore(state => state.lineHeight);
    console.log('Rendering SourceDoc with styles:', lineHeight, textSizePx, fontFamily);
    return (
        <Paper sx={{ ...styles.container }} elevation={3}>
            <Typography
                aria-label="Document Text"
                sx={{ fontSize: textSizePx, fontFamily, lineHeight }}
            >
                {doc.text || 'No content available'}
            </Typography>
        </Paper>
    );
}