import React from 'react';
import { Box, Typography } from '@mui/material';
import type { ChunkCompression } from 'types';

interface CompressionDisplayProps {
    selected: ChunkCompression | undefined;
    styles: any;
}

const CompressionDisplay: React.FC<CompressionDisplayProps> = ({ selected, styles }) => {
    if (!selected) return null;
    return (
        <Box sx={styles.flexWrapContainer}>
            <Typography variant="body1">{selected.compressed_text}</Typography>
        </Box>
    );
};

export default CompressionDisplay;
