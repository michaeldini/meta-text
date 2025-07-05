import React from 'react';
import { Box, Typography } from '@mui/material';

interface CompressionPreviewProps {
    preview: string | null;
}

const CompressionPreview: React.FC<CompressionPreviewProps> = ({ preview }) => {
    if (!preview) return null;
    return (
        <Box mt={3}>
            <Typography variant="subtitle2">Preview:</Typography>
            <Box p={2} borderRadius={1} mt={1}>
                <Typography variant="body1">{preview}</Typography>
            </Box>
        </Box>
    );
};

export default CompressionPreview;
