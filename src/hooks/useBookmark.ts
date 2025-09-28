// 
// React Query hook for managing chunk bookmarks per metatext/user
// Provides bookmark state, set, and remove mutation functions

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBookmark, setBookmark, removeBookmark } from '@services/bookmarksService';

export function useBookmark(metatextId: number) {
    const queryClient = useQueryClient();
    // Fetch the current bookmarked chunk id
    const {
        data: bookmarkedChunkId,
        isLoading,
    } = useQuery({
        queryKey: ['bookmark', metatextId],
        queryFn: () => fetchBookmark(metatextId),
    });

    // Mutation to set a bookmark
    const setMutation = useMutation({
        mutationFn: (chunkId: number) => setBookmark(metatextId, chunkId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmark', metatextId] });
            queryClient.invalidateQueries({ queryKey: ['chunks', metatextId] });
        },
    });

    // Mutation to remove a bookmark
    const removeMutation = useMutation({
        mutationFn: () => removeBookmark(metatextId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmark', metatextId] });
            queryClient.invalidateQueries({ queryKey: ['chunks', metatextId] });
        },
    });

    return {
        bookmarkedChunkId,
        isLoading,
        setBookmark: setMutation.mutate,
        removeBookmark: removeMutation.mutate,
    };
}
