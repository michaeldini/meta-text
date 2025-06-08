import React from 'react';
import Box from '@mui/material/Box';
import loadingGif from '../assets/logo-gif.gif';

/**
 * LoadingIndicator - displays a centered loading gif when loading is true.
 * Props:
 *   loading: boolean - whether to show the indicator
 *   size: number (optional) - size in px (default 48)
 *   sx: style overrides (optional)
 */
const LoadingIndicator = ({ loading, size = 48, sx }) => {
    if (!loading) return null;
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                ...sx,
            }}
        >
            <img
                src={loadingGif}
                alt="Loading..."
                style={{ width: size, height: size, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            />
        </Box>
    );
};

export default LoadingIndicator;
