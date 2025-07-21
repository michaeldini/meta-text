// TODO I don't know how this works. 

import React from 'react';
import { LOADING_CONSTANTS } from 'constants';
import { LoadingSpinner } from 'components';


/**
 * AppSuspenseFallback component provides a loading spinner fallback
 * for React Suspense boundaries. It is displayed while the app is loading.
 */
export function LoadingFallback(): React.ReactElement {
    return (
        <LoadingSpinner
            minHeight={LOADING_CONSTANTS.MIN_HEIGHT_SUSPENSE}
            aria-label="Loading application"
        />
    );
}

export default LoadingFallback;
