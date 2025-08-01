// Hook to encapsulate bookmark toggle logic for a chunk
// Handles state, mutations, and navigation clearing

import { useBookmarkUIStore } from '../store/bookmarkStore';
import { useBookmark, useSetBookmark, useRemoveBookmark } from '@features/chunk-bookmark';
import { ChunkType } from '@mtypes/documents';

export function useChunkBookmarkToggle(chunk: ChunkType) {
    // Get the current bookmarked chunk from React Query
    const { data: bookmarkedChunkId } = useBookmark(chunk.metatext_id);
    const setBookmarkMutation = useSetBookmark(chunk.metatext_id);
    const removeBookmarkMutation = useRemoveBookmark(chunk.metatext_id);
    // Use handler for bookmark status (pure logic)
    const isBookmarked = bookmarkedChunkId === chunk.id;
    const { clearNavigateToBookmark } = useBookmarkUIStore();

    // Handler for toggling bookmark status
    const handleToggle = async () => {
        if (isBookmarked) {
            removeBookmarkMutation.mutate();
            clearNavigateToBookmark();
        } else {
            setBookmarkMutation.mutate(chunk.id);
        }
    };

    return {
        isBookmarked,
        handleToggle,
    };
}
