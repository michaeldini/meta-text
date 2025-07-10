import React, { ReactNode } from 'react';
import { LOADING_CONSTANTS } from 'constants';
import { LoadingSpinner } from 'components';

/**
 * LoadingBoundary component for showing a loading spinner while loading is true.
 * Usage: <LoadingBoundary loading={loading}><Child /></LoadingBoundary>
 */
export default function LoadingBoundary({ loading, children }: { loading: boolean; children: ReactNode }) {
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
