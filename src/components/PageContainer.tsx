import React, { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import { ErrorBoundary } from 'components'
import { LoadingFallback } from 'components';

interface PageContainerProps {
    children: ReactNode;
    loading: boolean;
}

/**
 * Generic page container for consistent layout.
 * Wraps children in a Container with error boundary and theme-based styles.
 */
export function PageContainer(props: PageContainerProps): React.ReactElement {
    const { children, loading } = props;

    return (
        <ErrorBoundary>
            <React.Suspense fallback={<LoadingFallback />}>
                <Flex justify="center"  >
                    {children}
                </Flex>
            </React.Suspense>
        </ErrorBoundary>
    );
}

export default PageContainer;
