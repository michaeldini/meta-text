import { useCallback } from 'react';
import { useChunkStore } from '../../../../store/chunkStore';
import { MergeChunksToolProps, ToolResult } from '../types';

/**
 * Hook for merge chunks tool functionality
 */
export const useMergeChunks = () => {
    const handleRemoveChunk = useChunkStore(state => state.handleRemoveChunk);

    const mergeChunks = useCallback(async (props: MergeChunksToolProps): Promise<ToolResult> => {
        try {
            const { chunkIndices } = props;

            if (chunkIndices.length !== 2) {
                throw new Error('Merge operation requires exactly 2 chunks');
            }

            console.log('Merging chunks', { chunkIndices });

            // Use the existing store function to remove the first chunk (merge with next)
            const [firstChunk] = chunkIndices;
            handleRemoveChunk(firstChunk);

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
