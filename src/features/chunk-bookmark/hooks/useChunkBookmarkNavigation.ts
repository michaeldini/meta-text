// // Custom hook to handle navigation to a bookmarked chunk
// // Extracts the logic from PaginatedChunks to keep the component clean

// import React from 'react';
// import type { ChunkType } from '@mtypes/documents';
// import { findChunkIndex, getChunkPage, scrollToChunk } from '../handlers/bookmarkHandlers';
// import { useBookmark } from '@hooks/useBookmark';

// const useChunkBookmarkNavigation = (
//     metatextId: number,
//     chunks: ChunkType[],
//     chunksPerPage: number,
//     setPage: (page: number) => void
// ) => {
//     const { bookmarkedChunkId } = useBookmark(metatextId);

//     React.useEffect(() => {
//         if (bookmarkedChunkId != null) {
//             const idx = findChunkIndex(chunks, bookmarkedChunkId);
//             if (idx >= 0) {
//                 const page = getChunkPage(idx, chunksPerPage);
//                 setPage(page);
//                 setTimeout(() => {
//                     scrollToChunk(bookmarkedChunkId);
//                 }, 0);
//             }
//         }
//     }, [bookmarkedChunkId, chunks, chunksPerPage, setPage]);
// };

// export default useChunkBookmarkNavigation;
