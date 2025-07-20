import { apiGet, apiPost } from '../utils/api';

export async function fetchBookmark(metaTextId: number): Promise<number | null> {
    const res = await apiGet<number | null>(`/api/bookmarks/${metaTextId}`);
    return res ?? null;
}

export async function setBookmark(metaTextId: number, chunkId: number): Promise<number> {
    // Backend expects { metatext_id, chunk_id } in POST body
    const res = await apiPost<number>(`/api/bookmarks/`, { metatext_id: metaTextId, chunk_id: chunkId });
    return res;
}