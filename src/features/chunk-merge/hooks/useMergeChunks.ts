
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { combineChunks } from '@services/chunkService';
import { ChunkType } from '@mtypes/documents';

export interface MergeChunksToolProps {
    chunk: ChunkType;
    metatextId: number;
}
/**
 * Hook for merge chunks tool functionality using React Query
 */
export function useMergeChunks() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ chunk }: MergeChunksToolProps) => {
            return await combineChunks(chunk);
        },
        onSuccess: (_data, variables) => {
            // Refetch chunk data for the current metatext
            queryClient.invalidateQueries({ queryKey: ['metatextDetail', variables.metatextId] });
        },
    });
};
