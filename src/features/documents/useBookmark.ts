// React Query hooks for bookmark API
// Handles loading and setting bookmarks for metatext chunks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBookmark, setBookmark } from 'services';

// Fetch the bookmarked chunk for a metatext
export function useBookmark(metaTextId: number | null) {
    return useQuery<number | null>({
        queryKey: ['bookmark', metaTextId],
        queryFn: async () => {
            if (metaTextId == null) return null;
            return fetchBookmark(metaTextId);
        },
        enabled: metaTextId != null,
        staleTime: 1000 * 60, // 1 minute
    });
}

// Set the bookmarked chunk for a metatext
export function useSetBookmark(metaTextId: number | null) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (chunkId: number) => {
            if (metaTextId == null) throw new Error('No metatext ID provided');
            await setBookmark(metaTextId, chunkId);
            return chunkId;
        },
        onSuccess: (chunkId) => {
            if (metaTextId != null) {
                queryClient.setQueryData(['bookmark', metaTextId], chunkId);
            }
        },
    });
}
