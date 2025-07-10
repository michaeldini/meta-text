// Component for displaying source document content
// This component is responsible for rendering the text content of a source document
// with appropriate styles and preferences set by the user.
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

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

    const textSizePx = useUIPreferencesStore(state => state.textSizePx);
    const fontFamily = useUIPreferencesStore(state => state.fontFamily);
    const lineHeight = useUIPreferencesStore(state => state.lineHeight);
    console.log('Rendering SourceDoc with styles:', lineHeight, textSizePx, fontFamily);
    return (
        <Box sx={{
            width: '100%',
            paddingX: theme.spacing(2),
        }} data-testid="source-doc-container">
            <Typography
                aria-label="Document Text"
                sx={{ fontSize: textSizePx, fontFamily, lineHeight, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
            >
                {doc.text || 'No content available'}
            </Typography>
        </Box>
    );
}