// Hook to encapsulate bookmark toggle logic for a chunk
// Handles state, mutations, and navigation clearing

import { useBookmarkUIStore } from '../store/bookmarkStore';
import { useBookmark, useSetBookmark, useRemoveBookmark } from '@features/chunk-bookmark';
import { ChunkType } from '@mtypes/documents';

export function useChunkBookmarkToggle(chunk: ChunkType) {
    // Get the current bookmarked chunk from React Query
    const { data: bookmarkedChunkId } = useBookmark(chunk.metatext_id);
    // get the mutation functions
    const setBookmarkMutation = useSetBookmark(chunk.metatext_id);
    const removeBookmarkMutation = useRemoveBookmark(chunk.metatext_id);
    // decide if bookmark is already set
    const isBookmarked = bookmarkedChunkId === chunk.id;
    // get handler to clear/disable the navigate to bookmark button
    const { clearNavigateToBookmark } = useBookmarkUIStore();

    // Handler for toggling bookmark status
    const handleToggle = async () => {
        if (isBookmarked) {
            removeBookmarkMutation.mutate();
            clearNavigateToBookmark();
        } else {
            setBookmarkMutation.mutate(chunk.id);
            // setNavigateToBookmark()
            // how is the navigate to bookmark button being cleared?
        }
    };

    return {
        isBookmarked,
        handleToggle,
    };
}
