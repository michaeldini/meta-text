import React, { ReactNode } from 'react';

import { Spinner } from '@chakra-ui/react/spinner';

/**
 * LoadingBoundary component for showing a loading spinner while loading is true.
 * Usage: <LoadingBoundary loading={loading}><Child /></LoadingBoundary>
 */
export interface LoadingBoundaryProps {
    loading: boolean;
    children: ReactNode;
}
export default function LoadingBoundary(props: LoadingBoundaryProps): React.ReactElement {
    const { loading, children } = props;
    if (loading) {
        return (<Spinner
            aria-label="Loading content"
        />);
    }
    return <>{children}</>;
}
