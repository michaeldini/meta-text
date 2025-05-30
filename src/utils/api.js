// src/utils/api.js
// General API response handler for all services

export async function handleApiResponse(res, defaultErrorMsg = 'Request failed') {
    if (!res.ok) {
        let data;
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
