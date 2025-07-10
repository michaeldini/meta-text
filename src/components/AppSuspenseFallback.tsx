// TODO I don't know how this works. 

import React from 'react';
import { LOADING_CONSTANTS } from 'constants';
import { LoadingSpinner } from 'components';

const AppSuspenseFallback: React.FC = () => {
    return (
        <LoadingSpinner
            minHeight={LOADING_CONSTANTS.MIN_HEIGHT_SUSPENSE}
            aria-label="Loading application"
        />
    );
};

export default AppSuspenseFallback;
