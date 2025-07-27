import React, { ReactNode } from 'react';

import { LoadingSpinner } from 'components';

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
        return (
            <LoadingSpinner
                aria-label="Loading content"
            />
        );
    }
    return <>{children}</>;
}
