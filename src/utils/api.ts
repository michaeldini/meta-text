// src/utils/api.ts
// General API response handler for all services

interface ApiErrorResponse {
    detail?: string;
    error?: string;
    message?: string;
}

export async function handleApiResponse<T = unknown>(res: Response, defaultErrorMsg = 'Request failed'): Promise<T | true> {
    if (!res.ok) {
        let data: ApiErrorResponse = {};
        try {
            data = await res.json();
        } catch {
            data = {};
        }
        throw new Error(data.detail || data.error || data.message || defaultErrorMsg);
    }
    // Try to parse JSON, but allow for endpoints that return no content
    try {
        return await res.json();
    } catch {
        return true as T;
    }
}

export default handleApiResponse;
