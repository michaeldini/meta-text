import { Box, CircularProgress } from '@mui/material';
import type { ReactElement } from 'react';

export function LoadingIndicator(): ReactElement {
    return (
        <Box>
            <CircularProgress />
        </Box>
    );
}
