import React from 'react';
import { Box, Typography } from '@mui/material';
import CompressionTool from '../CompressionTool';
import { BaseChunkProps } from '../../types';

interface CompressionEmptyStateProps extends BaseChunkProps {
    fetchCompressions: () => void;
}

const CompressionEmptyState: React.FC<CompressionEmptyStateProps> = ({ chunk, fetchCompressions }) => (
    <Box>
        <Typography>No compressions available. Use the Compression Tool below to create a new compression for this chunk.</Typography>
        <Box sx={{ mt: 2 }}>
            <CompressionTool chunk={chunk} onCompressionCreated={fetchCompressions} />
        </Box>
    </Box>
);

export default CompressionEmptyState;
