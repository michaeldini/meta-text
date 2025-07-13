/**
 * @fileoverview LoadingSpinner component for general loading states
 * 
 * A reusable loading spinner component that displays a centered circular progress indicator.
 * This component includes its own styling and can be used throughout the application
 * whenever a loading state needs to be displayed.
 * 
 * @author Metatext Development Team
 * @version 1.0.0
 * @since 2025-07-09
 */

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
    minHeight: '200px',
    padding: 2,
};

/**
 * LoadingSpinner Component
 * 
 * A reusable loading spinner component that displays a centered circular progress indicator.
 * Perfect for replacing repetitive Box + CircularProgress combinations throughout the app.
 * 
 * @param props - Component props
 * @param props.size - Size of the circular progress indicator (default: 40)
 * @param props.color - Color of the spinner (default: 'primary')
 * @param props.sx - Custom styles to apply to the container
 * @param props.minHeight - Minimum height of the loading container (default: '200px')
 * @param props['aria-label'] - Accessibility label for the spinner (default: 'Loading content')
 * @returns {ReactElement} The loading spinner component
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <LoadingSpinner />
 * 
 * // With custom size and color
 * <LoadingSpinner size={60} color="secondary" />
 * 
 * // With custom styling
 * <LoadingSpinner sx={{ minHeight: '100px', backgroundColor: 'grey.50' }} />
 * ```
 */
export function LoadingSpinner({
    size = 40,
    color = 'primary',
    sx,
    minHeight = '200px',
    'aria-label': ariaLabel = 'Loading content',
}: LoadingSpinnerProps): ReactElement {
    const combinedStyles: SxProps<Theme> = [
        defaultStyles,
        { minHeight },
        ...(Array.isArray(sx) ? sx : [sx]),
    ];

    return (
        <Box sx={combinedStyles}>
            <CircularProgress size={size} color={color} aria-label={ariaLabel} />
        </Box>
    );
}
