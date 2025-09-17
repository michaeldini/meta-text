// // Pure functions for bookmark operations
// // Used by hooks/components for chunk bookmark logic

// import type { ChunkType } from '@mtypes/documents';

// // Find chunk index by id
// export function findChunkIndex(chunks: ChunkType[], chunkId: number): number {
//     return chunks.findIndex((c) => c.id === chunkId);
// }

// // Calculate page for chunk index
// export function getChunkPage(idx: number, chunksPerPage: number): number {
//     return Math.floor(idx / chunksPerPage) + 1;
// }

// // Scroll to chunk element by id
// export function scrollToChunk(chunkId: number) {
//     const el = document.querySelector(`[data-chunk-id="${chunkId}"]`);
//     if (el) {
//         (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
// }
