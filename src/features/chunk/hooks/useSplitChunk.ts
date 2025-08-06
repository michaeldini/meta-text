/**
 * useSplitChunk
 * React Query mutation hook for splitting a chunk and refetching chunk data.
 * Use this in components instead of calling splitChunk directly in Zustand.
 * Keeps Zustand in sync via useChunksQuery effect during migration.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { splitChunk } from '@services/chunkService';

interface SplitChunkArgs {
    chunkId: number;
    wordIdx: number;
    metatextId: number;
}

export function useSplitChunk() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ chunkId, wordIdx }: SplitChunkArgs) => {
            return await splitChunk(chunkId, wordIdx + 1);
        },
        onSuccess: (_data, variables) => {
            // Refetch chunk data for the current metatext
            queryClient.invalidateQueries({ queryKey: ['metatextDetail', variables.metatextId] });
        },
    });
}
