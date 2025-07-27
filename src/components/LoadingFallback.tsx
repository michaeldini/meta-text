// TODO I don't know how this works. 

import React from 'react';
import { LoadingSpinner } from 'components';


/**
 * AppSuspenseFallback component provides a loading spinner fallback
 * for React Suspense boundaries. It is displayed while the app is loading.
 */
export function LoadingFallback(): React.ReactElement {
    return (
        <LoadingSpinner
            aria-label="Loading application"
        />
    );
}

export default LoadingFallback;
