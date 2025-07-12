import { useCallback } from 'react';
import { useChunkStore } from 'store';
import { MergeChunksToolProps, ToolResult } from 'features/chunk-shared/types';

/**
 * Hook for merge chunks tool functionality
 */
export const useMergeChunks = () => {
    const handleMergeChunks = useChunkStore(state => state.mergeChunks);

    const mergeChunks = useCallback(async (props: MergeChunksToolProps): Promise<ToolResult> => {
        try {
            const { chunkIndices } = props;

            // Validate that we have exactly 2 consecutive chunks to merge
            if (chunkIndices.length !== 2) {
                throw new Error('Exactly 2 consecutive chunks must be selected for merging');
            }

            // Use the existing store function with the first chunk index
            const [firstChunkIndex] = chunkIndices;
            await handleMergeChunks(firstChunkIndex);

            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to merge chunks'
            };
        }
    }, [handleMergeChunks]);

    return {
        mergeChunks
    };
};
