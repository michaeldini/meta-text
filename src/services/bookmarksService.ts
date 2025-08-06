import { api } from '../utils/ky';

// Fetch the user's bookmarked chunk id for a given metatext
export async function fetchBookmark(metatextId: number): Promise<number | null> {
    console.log('metatextId', metatextId)
    const res = await api.get(`bookmarks/${metatextId}`).json<{ chunk_id: number | null }>();
    return res.chunk_id ?? null;
}

// Set the user's bookmark for a given metatext and chunk
export async function setBookmark(metaTextId: number, chunkId: number): Promise<number> {
    const res = await api.post('bookmarks/', { json: { metatext_id: metaTextId, chunk_id: chunkId } }).json<{ chunk_id: number }>();
    return res.chunk_id;
}

// Remove the user's bookmark for a given metatext
export async function removeBookmark(metaTextId: number): Promise<void> {
    await api.delete(`bookmarks/${metaTextId}`);
}