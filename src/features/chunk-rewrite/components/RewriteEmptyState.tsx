import React from 'react';
import { Box, Typography } from '@mui/material';
import RewriteTool from '../RewriteTool';
import type { RewriteEmptyStateProps } from 'features/chunk-shared/types';

const RewriteEmptyState: React.FC<RewriteEmptyStateProps> = ({ chunk, onRewriteCreated }) => (
    <Box>
        <Typography>No rewrites available. Use the Rewrite Tool below to create a new rewrite for this chunk.</Typography>
        <Box sx={{ mt: 2 }}>
            <RewriteTool chunk={chunk} onRewriteCreated={onRewriteCreated} />
        </Box>
    </Box>
);

export default RewriteEmptyState;
