import React, { ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { LOADING_CONSTANTS } from './constants';

/**
 * LoadingBoundary component for showing a loading spinner while loading is true.
 * Usage: <LoadingBoundary loading={loading}><Child /></LoadingBoundary>
 */
export default function LoadingBoundary({ loading, children }: { loading: boolean; children: ReactNode }) {
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={LOADING_CONSTANTS.MIN_HEIGHT_BOUNDARY}>
                <CircularProgress aria-label="Loading content" />
            </Box>
        );
    }
    return <>{children}</>;
}
