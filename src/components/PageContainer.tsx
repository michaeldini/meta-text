import React, { ReactNode } from 'react';
import { Container, useTheme } from '@mui/material';
import { getPageStyles, getTopLevelStyles } from '../styles/styles';

import { ErrorBoundary, LoadingBoundary } from 'components'
/**
 * Generic page container for consistent layout.
 * Wraps children in a Container with error boundary and theme-based styles.
 */


export default function PageContainer({ children, loading }: { children: ReactNode, loading: boolean }) {
    const theme = useTheme();

    return (
        <ErrorBoundary>
            <Container maxWidth={false} sx={getPageStyles(theme)}>
                <LoadingBoundary loading={loading}>
                    {children}
                </LoadingBoundary>
            </Container>
        </ErrorBoundary>
    );
}
