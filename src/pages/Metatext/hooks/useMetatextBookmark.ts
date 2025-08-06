// useMetatextBookmark - Encapsulates all bookmark logic for MetatextDetailPage
// Returns bookmarkedChunkId, goToBookmark handler, and loading state
import { useBookmark } from '@hooks/useBookmark';
import useChunkBookmarkNavigation from '@features/chunk-bookmark/hooks/useChunkBookmarkNavigation';
import { scrollToChunk } from '@features/chunk-bookmark/handlers/bookmarkHandlers';

export function useMetatextBookmark(
    metatextId: number,
    paginatedChunksProps: {
        displayChunks: any[];
        chunksPerPage: number;
        setCurrentPage: (page: number) => void;
    }
) {
    // Get the bookmarked chunk id for this metatext
    const { bookmarkedChunkId, isLoading: bookmarkLoading } = useBookmark(metatextId);
    // Navigation logic only runs when header button is clicked
    const goToBookmark = () => {
        if (bookmarkedChunkId == null) return;
        // Find chunk index
        const idx = paginatedChunksProps.displayChunks.findIndex((c: any) => c.id === bookmarkedChunkId);
        if (idx < 0) return;
        // Calculate page
        const page = Math.floor(idx / paginatedChunksProps.chunksPerPage) + 1;
        paginatedChunksProps.setCurrentPage(page);
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
