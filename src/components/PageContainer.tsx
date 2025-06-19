import React, { ReactNode } from 'react';
import { Container } from '@mui/material';
import { pageContainer } from '../styles/styles';
import ErrorBoundary from './ErrorBoundary';

/**
 * Generic page container for consistent layout.
 * Wraps children in a centered, max-width Material UI Container.
 * Now also wraps children in an ErrorBoundary for global error handling.
 */
export default function PageContainer({ children }: { children: ReactNode }) {
    return (
        <Container maxWidth="lg" sx={pageContainer}>
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </Container>
    );
}
