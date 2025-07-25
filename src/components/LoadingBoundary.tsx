import React, { ReactNode } from 'react';
import { LOADING_CONSTANTS } from 'constants';
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
                minHeight={LOADING_CONSTANTS.MIN_HEIGHT_BOUNDARY}
                aria-label="Loading content"
            />
        );
    }
    return <>{children}</>;
}
