// src/utils/api.ts
// Improved API response handler with better typing and consistency

import log from './logger';

interface ApiErrorResponse {
    detail?: string;
    error?: string;
    message?: string;
}

/**
 * Enhanced API response handler that provides consistent error handling
 * and proper typing without confusing union types
 */
export async function handleApiResponse<T>(
    res: Response,
    defaultErrorMsg = 'Request failed'
): Promise<T> {
    if (!res.ok) {
        let errorData: ApiErrorResponse = {};
        try {
            errorData = await res.json();
        } catch {
            // Response has no JSON body
        }
        const errorMessage = errorData.detail || errorData.error || errorData.message || defaultErrorMsg;
        log.error(`API Error: ${res.status} ${res.statusText} - ${errorMessage}`, errorData);
        throw new Error(errorMessage);
    }

    // Handle responses with no content (204, etc.)
    if (res.status === 204 || res.headers.get('content-length') === '0') {
        return {} as T;
    }

    try {
        const data = await res.json();
        return data as T;
    } catch (parseError) {
        log.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid JSON response from server');
    }
}

/**
 * Generic API request wrapper with consistent error handling
 */
export async function apiRequest<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Don't set Content-Type for FormData (let browser set it with boundary)
    // Also don't override Content-Type for URLSearchParams 
    if (options.body instanceof FormData) {
        delete (defaultHeaders as any)['Content-Type'];
    } else if (options.body instanceof URLSearchParams) {
        // Keep the passed Content-Type for URLSearchParams (likely application/x-www-form-urlencoded)
        if (options.headers && (options.headers as any)['Content-Type']) {
            (defaultHeaders as any)['Content-Type'] = (options.headers as any)['Content-Type'];
        }
    }

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        return await handleApiResponse<T>(response, `Request to ${url} failed`);
    } catch (error) {
        log.error(`API request failed: ${url}`, error);
        throw error;
    }
}

/**
 * Helper for GET requests
 */
export async function apiGet<T>(url: string, options?: RequestInit): Promise<T> {
    return apiRequest<T>(url, { ...options, method: 'GET' });
}

/**
 * Helper for POST requests
 */
export async function apiPost<T>(
    url: string,
    data?: unknown,
    options?: RequestInit
): Promise<T> {
    const body = data instanceof FormData || data instanceof URLSearchParams 
        ? data 
        : JSON.stringify(data);
    return apiRequest<T>(url, { ...options, method: 'POST', body });
}

/**
 * Helper for PUT requests
 */
export async function apiPut<T>(
    url: string,
    data?: unknown,
    options?: RequestInit
): Promise<T> {
    return apiRequest<T>(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * Helper for DELETE requests
 */
export async function apiDelete<T>(url: string, options?: RequestInit): Promise<T> {
    return apiRequest<T>(url, { ...options, method: 'DELETE' });
}

// Legacy export for backward compatibility (to be removed)
export default handleApiResponse;
