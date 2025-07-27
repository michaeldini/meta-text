import React from 'react';
import { Box, Typography } from '@mui/material';
import type { RewriteDisplayProps } from 'features/chunk-shared/types';



export function RewriteDisplay({ selected }: RewriteDisplayProps) {
    if (!selected) return null;
    return (
        <Box>
            <Typography variant="body1">{selected.rewrite_text}</Typography>
        </Box>
    );
}
export default RewriteDisplay;