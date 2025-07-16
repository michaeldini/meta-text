
// API helpers for persistent chunk bookmarks (per user/metatext)
import { apiGet, apiPost } from '../utils/api';

/**
 * Fetch the bookmarked chunkId for a given metatext for the current user.
 * Returns chunkId or null if not set.
 */
export async function fetchBookmark(metaTextId: number): Promise<number | null> {
    const res = await apiGet<number | null>(`/api/bookmarks/${metaTextId}`);
    return res ?? null;
}

/**
 * Set the bookmark for a metatext/chunk for the current user.
 * Returns the chunkId that was set.
 */
export async function setBookmark(metaTextId: number, chunkId: number): Promise<number> {
    // Backend expects { meta_text_id, chunk_id } in POST body
    const res = await apiPost<number>(`/api/bookmarks/`, { meta_text_id: metaTextId, chunk_id: chunkId });
    return res;
}

/**
 * Clear the bookmark for a metatext for the current user.
 * Returns true if bookmark was cleared, false if it didn't exist.
//  */
// export async function clearBookmark(metaTextId: number): Promise<boolean> {
//     try {
//         // Backend expects { meta_text_id } in POST body to clear bookmark
//         await apiPost(`/api/bookmarks/clear`, { meta_text_id: metaTextId });
//         return true;
//     } catch (err) {
//         // If bookmark didn't exist, backend might throw an error
//         if (err instanceof Error && err.message.includes('404')) {
//             return false; // Bookmark didn't exist
//         } else {
//             throw err; // Re-throw unexpected errors
//         }
//     }
// }