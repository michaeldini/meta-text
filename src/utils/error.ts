/**
 * Common error interfaces for the application
 */

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    details?: Record<string, unknown>;
}

/**
 * Type guard to check if an error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as ApiError).message === 'string'
    );
}

/**
 * Utility function to extract error message from unknown error
 */
export function getErrorMessage(error: unknown, defaultMessage = 'An error occurred'): string {
    if (typeof error === 'string') {
        return error;
    }

    if (isApiError(error)) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'object' && error !== null) {
        // Check for common API error response formats
        const errorObj = error as Record<string, unknown>;
        if (typeof errorObj.message === 'string') {
            return errorObj.message;
        }
        if (typeof errorObj.detail === 'string') {
            return errorObj.detail;
        }
    }

    return defaultMessage;
}
