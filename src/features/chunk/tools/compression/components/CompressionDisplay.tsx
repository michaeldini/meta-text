import React from 'react';
import { Box, Typography } from '@mui/material';
import type { CompressionDisplayProps } from '../../types';

const CompressionDisplay: React.FC<CompressionDisplayProps> = ({ selected, styles }) => {
    if (!selected) return null;
    return (
        <Box sx={styles.compressionDisplayWordsContainer}>
            <Typography variant="body1">{selected.compressed_text}</Typography>
        </Box>
    );
};

export default CompressionDisplay;
