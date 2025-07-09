import React, { ReactNode } from 'react';
import { Container, useTheme } from '@mui/material';
import { getAppStyles } from '../styles/styles';

import { ErrorBoundary, LoadingBoundary } from 'components'

interface PageContainerProps {
    children: ReactNode;
    loading: boolean;
}

/**
 * Generic page container for consistent layout.
 * Wraps children in a Container with error boundary and theme-based styles.
 */
const PageContainer: React.FC<PageContainerProps> = ({ children, loading }) => {
    const theme = useTheme();
    const styles = getAppStyles(theme);

    return (
        <ErrorBoundary>
            <Container maxWidth={false} sx={styles.pageLayout}>
                <LoadingBoundary loading={loading}>
                    {children}
                </LoadingBoundary>
            </Container>
        </ErrorBoundary>
    );
};

export default PageContainer;
