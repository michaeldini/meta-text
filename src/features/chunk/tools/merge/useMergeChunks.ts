import { useCallback } from 'react';
import { useChunkStore } from 'store';
import { MergeChunksToolProps, ToolResult } from '../types';

/**
 * Hook for merge chunks tool functionality
 */
export const useMergeChunks = () => {
    const handleRemoveChunk = useChunkStore(state => state.handleRemoveChunk);

    const mergeChunks = useCallback(async (props: MergeChunksToolProps): Promise<ToolResult> => {
        try {
            const { chunkIndices } = props;

            // Use the existing store function to remove the first chunk (merge with next)
            const [firstChunk] = chunkIndices;
            await handleRemoveChunk(firstChunk);

            return {
                success: true,
                data: { mergedChunks: chunkIndices }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to merge chunks'
            };
        }
    }, [handleRemoveChunk]);

    return {
        mergeChunks
    };
};
