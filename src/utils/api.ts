// src/utils/api.ts
// General API response handler for all services

export async function handleApiResponse<T = any>(res: Response, defaultErrorMsg = 'Request failed'): Promise<T | true> {
    if (!res.ok) {
        let data: any;
        try { data = await res.json(); } catch { data = {}; }
        throw new Error(data.detail || data.error || defaultErrorMsg);
    }
    // Try to parse JSON, but allow for endpoints that return no content
    try {
        return await res.json();
    } catch {
        return true;
    }
}

export default handleApiResponse;
