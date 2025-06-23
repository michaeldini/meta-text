import { apiGet, apiPost } from '../utils/api';
import type { UserChunkSessionRead, UserChunkSessionCreate } from '../types/userChunkSession';
import { withCache, apiCache } from '../utils/cache';

const API_BASE = '/api';

// Base function for fetching user chunk session
async function _getUserChunkSession(userId: number, metaTextId: number): Promise<UserChunkSessionRead | null> {
    try {
        const data = await apiGet<UserChunkSessionRead>(`${API_BASE}/user-chunk-session/?user_id=${userId}&meta_text_id=${metaTextId}`);
        return data;
    } catch (e: any) {
        if (e instanceof Error && e.message?.toLowerCase().includes('not found')) return null;
        throw e;
    }
}

// Cached version (5 minutes)
export const getUserChunkSession = withCache(
    'getUserChunkSession',
    _getUserChunkSession,
    5 * 60 * 1000 // 5 minutes
);

export async function setUserChunkSession(data: UserChunkSessionCreate): Promise<UserChunkSessionRead> {
    const res = await apiPost<UserChunkSessionRead>(`${API_BASE}/user-chunk-session/`, data);
    // Invalidate cache for this user/metaText
    apiCache.invalidate(`getUserChunkSession:${data.user_id}|${data.meta_text_id}`);
    return res;
}
