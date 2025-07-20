import React from 'react';
import { Box, Typography } from '@mui/material';
import type { RewriteDisplayProps } from 'features/chunk-shared/types';

const RewriteDisplay: React.FC<RewriteDisplayProps> = ({ selected, styles }) => {
    if (!selected) return null;
    return (
        <Box sx={styles.rewriteDisplayWordsContainer}>
            <Typography variant="body1">{selected.rewrite_text}</Typography>
        </Box>
    );
};

export default RewriteDisplay;
