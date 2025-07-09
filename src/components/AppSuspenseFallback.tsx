import { CircularProgress, Box } from '@mui/material';
import React from 'react';
import { LOADING_CONSTANTS } from 'constants';

const AppSuspenseFallback: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: LOADING_CONSTANTS.MIN_HEIGHT_SUSPENSE }}>
            <CircularProgress aria-label="Loading application" />
        </Box>
    );
};

export default AppSuspenseFallback;
