// -----------------------------
// API Utility Functions for JWT Auth
// -----------------------------

// This file provides robust, readable, and modern API helpers for a JWT-authenticated FastAPI backend.
// - All requests automatically include the JWT token from Zustand store or localStorage.
// - Consistent error handling: 401 triggers auth flow, other errors are surfaced to the UI.
// - GET, POST, PUT, DELETE helpers are provided for convenience.

// --- Types ---
interface ApiErrorResponse {
    detail?: string;
    error?: string;
    message?: string;
}

/**
 * Handles a fetch Response, parsing JSON and surfacing errors in a consistent way.
 * Throws a special error for 401 Unauthorized (invalid/missing JWT),
 * otherwise throws a regular Error with the backend's message.
 * Returns parsed data for successful responses.
 */
export async function handleApiResponse<T>(res: Response, defaultErrorMsg = 'Request failed'): Promise<T> {
    // 401: Not authenticated (invalid/missing JWT)
    if (res.status === 401) {
        const err: any = new Error('Not authenticated');
        err.isAuthError = true;
        throw err;
    }

    // 204 No Content or empty response
    if (res.status === 204 || res.headers.get('content-length') === '0') {
        return {} as T;
    }

    // Try to parse JSON
    let data: any = null;
    try {
        data = await res.json();
    } catch {
        // Not JSON, treat as error
        throw new Error(defaultErrorMsg);
    }

    // 2xx: Success
    if (res.ok) {
        return data as T;
    }

    // Other errors: try to extract a message
    const errorMessage = data?.detail || data?.error || data?.message || defaultErrorMsg;
    throw new Error(errorMessage);
}

/**
 * Gets the JWT token from Zustand store or localStorage (persisted by zustand/middleware).
 * Returns null if not found.
 */
async function getAuthToken(): Promise<string | null> {
    // Try Zustand store (works in browser, avoids SSR issues)
    try {
        // Use dynamic import to avoid SSR issues in Next.js/Vite SSR
        if (typeof window !== 'undefined') {
            const mod = await import('../store/authStore');
            return mod.useAuthStore.getState().token;
        }
    } catch {
        // Fallback to localStorage (browser only)
        if (typeof window !== 'undefined') {
            try {
                const persisted = localStorage.getItem('auth-storage');
                if (persisted) {
                    const parsed = JSON.parse(persisted);
                    return parsed.state?.token || parsed.token || null;
                }
            } catch { }
        }
    }
    return null;
}

/**
 * Core API request function. Adds JWT Authorization header if available.
 * Handles Content-Type for JSON, FormData, and URLSearchParams.
 * Throws for network errors or non-2xx responses (see handleApiResponse).
 */
export async function apiRequest<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Remove Content-Type for FormData (let browser set it)
    if (options.body instanceof FormData) {
        delete (defaultHeaders as any)['Content-Type'];
    } else if (options.body instanceof URLSearchParams) {
        // Keep Content-Type for URLSearchParams if provided
        if (options.headers && (options.headers as any)['Content-Type']) {
            (defaultHeaders as any)['Content-Type'] = (options.headers as any)['Content-Type'];
        }
    }

    // Add JWT token if available (awaited)
    const token = await getAuthToken();
    const headers: HeadersInit = {
        ...defaultHeaders,
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config: RequestInit = {
        ...options,
        headers,
    };

    let response: Response;
    try {
        response = await fetch(url, config);
    } catch (err) {
        throw new Error('Network error');
    }
    return handleApiResponse<T>(response, `Request to ${url} failed`);
}

/**
 * Helper for GET requests. Usage: apiGet('/api/foo')
 */
export async function apiGet<T>(url: string, options?: RequestInit): Promise<T> {
    return apiRequest<T>(url, { ...options, method: 'GET' });
}

/**
 * Helper for POST requests. Usage: apiPost('/api/foo', { foo: 'bar' })
 */
export async function apiPost<T>(
    url: string,
    data?: unknown,
    options?: RequestInit
): Promise<T> {
    let body: BodyInit | undefined = undefined;
    if (data instanceof FormData || data instanceof URLSearchParams) {
        body = data;
    } else if (data !== undefined) {
        body = JSON.stringify(data);
    }
    return apiRequest<T>(url, { ...options, method: 'POST', body });
}

/**
 * Helper for PUT requests. Usage: apiPut('/api/foo/1', { foo: 'bar' })
 */
export async function apiPut<T>(
    url: string,
    data?: unknown,
    options?: RequestInit
): Promise<T> {
    let body: BodyInit | undefined = undefined;
    if (data instanceof FormData || data instanceof URLSearchParams) {
        body = data;
    } else if (data !== undefined) {
        body = JSON.stringify(data);
    }
    return apiRequest<T>(url, { ...options, method: 'PUT', body });
}

/**
 * Helper for DELETE requests. Usage: apiDelete('/api/foo/1')
 */
export async function apiDelete<T>(url: string, options?: RequestInit): Promise<T> {
    return apiRequest<T>(url, { ...options, method: 'DELETE' });
}
