// 
// React Query hook for managing chunk bookmarks per metatext/user
// Provides bookmark state, set, and remove mutation functions

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBookmark, setBookmark, removeBookmark } from '../services/bookmarksService';

export function useBookmark(metatextId: number) {
    const queryClient = useQueryClient();
    // Fetch the current bookmarked chunk id
    console.log('metatextId', metatextId)
    const {
        data: bookmarkedChunkId,
        isLoading,
        isError,
        error,
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
        isError,
        error,
        setBookmark: setMutation.mutate,
        setBookmarkAsync: setMutation.mutateAsync,
        isSetting: setMutation.isPending,
        removeBookmark: removeMutation.mutate,
        removeBookmarkAsync: removeMutation.mutateAsync,
        isRemoving: removeMutation.isPending,
    };
}
