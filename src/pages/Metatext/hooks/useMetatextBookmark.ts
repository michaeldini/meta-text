// useMetatextBookmark - Encapsulates all bookmark logic for MetatextDetailPage
// Returns bookmarkedChunkId, goToBookmark handler, and loading state
import { useBookmark } from '@hooks/useBookmark';
import { scrollToChunk } from '@features/chunk-bookmark/handlers/bookmarkHandlers';
import { ChunkType } from '@mtypes/documents';

export function useMetatextBookmark(
    metatextId: number,
    displayChunks: ChunkType[],
    chunksPerPage: number,
    setCurrentPage: (page: number) => void
) {
    // Get the bookmarked chunk id for this metatext
    const { bookmarkedChunkId, isLoading: bookmarkLoading } = useBookmark(metatextId);
    // Navigation logic only runs when header button is clicked
    const goToBookmark = () => {
        if (bookmarkedChunkId == null) return;
        // Find chunk index
        const idx = displayChunks.findIndex((c: any) => c.id === bookmarkedChunkId);
        if (idx < 0) return;
        // Calculate page
        const page = Math.floor(idx / chunksPerPage) + 1;
        setCurrentPage(page);
        setTimeout(() => {
            scrollToChunk(bookmarkedChunkId);
        }, 0);
    };
    return {
        bookmarkedChunkId,
        goToBookmark,
        bookmarkLoading,
    };
}
