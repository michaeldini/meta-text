import { Box, CircularProgress, type SxProps, type Theme } from '@mui/material';
import type { ReactElement } from 'react';

/**
 * LoadingSpinner Component Props
 */
export interface LoadingSpinnerProps {
    /** Size of the circular progress indicator */
    size?: number | string;
    /** Color of the spinner */
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
    /** Custom styles to apply to the container */
    sx?: SxProps<Theme>;
    /** Minimum height of the loading container */
    minHeight?: number | string;
    /** Accessibility label for the spinner */
    'aria-label'?: string;
}

/**
 * Default styles for the LoadingSpinner component
 */
const defaultStyles: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 2,
};

export function LoadingSpinner({
    size = 40,
    color = 'primary',
    sx,
    'aria-label': ariaLabel = 'Loading content',
}: LoadingSpinnerProps): ReactElement {
    const combinedStyles: SxProps<Theme> = [
        defaultStyles,
        { minHeight: '40px' },
        ...(Array.isArray(sx) ? sx : [sx]),
    ];

    return (
        <Box sx={combinedStyles}>
            <CircularProgress size={size} color={color} aria-label={ariaLabel} />
        </Box>
    );
}
