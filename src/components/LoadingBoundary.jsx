import React from 'react';
import { Box, CircularProgress } from '@mui/material';

/**
 * LoadingBoundary component for showing a loading spinner while loading is true.
 * Usage: <LoadingBoundary loading={loading}><Child /></LoadingBoundary>
 */
export default function LoadingBoundary({ loading, children }) {
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
                <CircularProgress />
            </Box>
        );
    }
    return children;
}
