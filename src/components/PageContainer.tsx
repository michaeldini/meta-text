import React, { ReactNode } from 'react';
import { Container, useTheme } from '@mui/material';
import { getTopLevelStyles } from '../styles/styles';
import ErrorBoundary from './ErrorBoundary';

/**
 * Generic page container for consistent layout.
 * Wraps children in a centered, max-width Material UI Container.
 * Now also wraps children in an ErrorBoundary for global error handling.
 */


export default function PageContainer({ children }: { children: ReactNode }) {
    const theme = useTheme();

    const pageContainerStyles = {
        // Layout structure
        display: 'flex',
        flexDirection: 'column' as const,
        width: '100%',
        height: '100%', // Ensure full viewport height
        flex: 1,
        minHeight: 0, // Allow children to shrink if needed
        maxWidth: 1400,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: theme.spacing(0),
        paddingRight: theme.spacing(0),
        backgroundColor: theme.palette.background.default,
    }

    return (
        <Container maxWidth={false} sx={pageContainerStyles}>
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </Container>
    );
}
