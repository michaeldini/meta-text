// Hook to encapsulate bookmark toggle logic for a chunk
// Handles state, mutations, and navigation clearing
import { useState } from 'react';
import { useBookmarkUIStore } from '../store/bookmarkStore';
import { ChunkType } from '@mtypes/documents';
import { useAuthStore } from '@store/authStore';
import { useChunkStore } from '@store/chunkStore';

export function useChunkBookmarkToggle(chunk: ChunkType) {
    const { user } = useAuthStore();
    const userId = user?.id;
    const isBookmarked = chunk.bookmarked_by_user_id === userId;
    const { clearNavigateToBookmark } = useBookmarkUIStore();
    const { toggleChunkBookmark } = useChunkStore();

    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            if (!userId) {
                console.warn('User not authenticated, cannot toggle bookmark');
                return;
            }
            // Use new toggleChunkBookmark to clear other bookmarks and set/unset this one
            toggleChunkBookmark(chunk.id, userId, chunk.metatext_id, !isBookmarked);
            clearNavigateToBookmark();
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isBookmarked,
        handleToggle,
        isLoading,
    };
}
