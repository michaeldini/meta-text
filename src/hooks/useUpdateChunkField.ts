// useUpdateChunkField.ts
// Brief: React Query hook for updating a single field of a chunk

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateChunk } from '@services/chunkService';
import type { ChunkType } from '@mtypes/documents';
interface UpdateChunkFieldArgs {
    chunkId: number;
    field: string;
    value: unknown;
}

export function useUpdateChunkField() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chunkId, field, value }: UpdateChunkFieldArgs) =>
            updateChunk(chunkId, { [field]: value }),
        onSuccess: (updatedChunk: ChunkType) => {
            // Invalidate or update cache as needed
            queryClient.invalidateQueries({ queryKey: ['metatextDetail', updatedChunk.metatext_id] });
        },
    });
}
