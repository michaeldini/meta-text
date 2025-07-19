import React from 'react';
import { Box, Typography } from '@mui/material';
import type { CompressionDisplayProps } from 'features/chunk-shared/types';

const CompressionDisplay: React.FC<CompressionDisplayProps> = ({ selected, styles }) => {
    if (!selected) return null;
    return (
        <Box sx={styles.compressionDisplayWordsContainer}>
            <Typography variant="body1">{selected.rewrite_text}</Typography>
        </Box>
    );
};

export default CompressionDisplay;
