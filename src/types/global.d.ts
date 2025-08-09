// TODO: is this needed here?

import React from 'react';

// Global logger interface for error handling
export interface Logger {
    error: (message: string, error: Error, errorInfo?: React.ErrorInfo) => void;
}

declare global {
    interface Window {
        logger?: Logger;
    }
}

export { }; // Make this a module
