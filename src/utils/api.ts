// src/utils/api.ts
// General API response handler for all services

interface ApiErrorResponse {
    detail?: string;
    error?: string;
    message?: string;
}

export async function handleApiResponse<T = unknown>(res: Response, defaultErrorMsg = 'Request failed'): Promise<T> {
    if (!res.ok) {
        let data: ApiErrorResponse = {};
        try {
            data = await res.json();
        } catch {
            data = {};
        }
        throw new Error(data.detail || data.error || data.message || defaultErrorMsg);
    }

    // Handle responses with no content (204, etc.)
    if (res.status === 204 || res.headers.get('content-length') === '0') {
        return {} as T;
    }

    // Try to parse JSON, but return empty object for empty responses
    try {
        return await res.json();
    } catch {
        return {} as T;
    }
}

export default handleApiResponse;
