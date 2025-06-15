import { CircularProgress, Box } from '@mui/material';
import React from 'react';

export function AppSuspenseFallback() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
        </Box>
    );
}
