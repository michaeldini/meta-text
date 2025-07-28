// TODO I don't know how this works. 

import React from 'react';
import { Spinner } from '@chakra-ui/react/spinner';

/**
 * AppSuspenseFallback component provides a loading spinner fallback
 * for React Suspense boundaries. It is displayed while the app is loading.
 */
export function LoadingFallback(): React.ReactElement {
    return (
        <Spinner
            aria-label="Loading application"
        />
    );
}

export default LoadingFallback;
