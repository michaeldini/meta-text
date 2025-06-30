import React, { ReactNode } from 'react';
import { Container, useTheme } from '@mui/material';
import { getPageStyles, getTopLevelStyles } from '../styles/styles';
import ErrorBoundary from './ErrorBoundary';

/**
 * Generic page container for consistent layout.
 * Wraps children in a centered, max-width Material UI Container.
 * Now also wraps children in an ErrorBoundary for global error handling.
 */


export default function PageContainer({ children }: { children: ReactNode }) {
    const theme = useTheme();

    return (
        <Container maxWidth={false} sx={getPageStyles(theme)}>
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </Container>
    );
}
