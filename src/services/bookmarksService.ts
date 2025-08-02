// import { api } from '../utils/ky';

// export async function fetchBookmark(metaTextId: number): Promise<number | null> {
//     const res = await api.get(`bookmarks/${metaTextId}`).json<number | null>();
//     return res ?? null;
// }

// export async function setBookmark(metaTextId: number, chunkId: number): Promise<number> {
//     // Backend expects { metatext_id, chunk_id } in POST body
//     const res = await api.post('bookmarks/', { json: { metatext_id: metaTextId, chunk_id: chunkId } }).json<number>();
//     return res;
// }
// export async function removeBookmark(metaTextId: number): Promise<void> {
//     await api.delete(`bookmarks/${metaTextId}`);
// }