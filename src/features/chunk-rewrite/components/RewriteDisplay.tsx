import React from 'react';
import { Box, Typography } from '@mui/material';
import type { RewriteDisplayProps } from 'features/chunk-shared/types';



export function RewriteDisplay({ selected, styles }: RewriteDisplayProps) {
    if (!selected) return null;
    return (
        <Box sx={styles.rewriteDisplayWordsContainer}>
            <Typography variant="body1">{selected.rewrite_text}</Typography>
        </Box>
    );
}
export default RewriteDisplay;