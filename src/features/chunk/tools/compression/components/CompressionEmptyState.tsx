import React from 'react';
import { Box, Typography } from '@mui/material';
import CompressionTool from '../CompressionTool';
import type { CompressionEmptyStateProps } from '../../types';

const CompressionEmptyState: React.FC<CompressionEmptyStateProps> = ({ chunk, onCompressionCreated }) => (
    <Box>
        <Typography>No compressions available. Use the Compression Tool below to create a new compression for this chunk.</Typography>
        <Box sx={{ mt: 2 }}>
            <CompressionTool chunk={chunk} onCompressionCreated={onCompressionCreated} />
        </Box>
    </Box>
);

export default CompressionEmptyState;
