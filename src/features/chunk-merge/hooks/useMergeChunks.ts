import { useCallback } from 'react';
import { useChunkStore } from '@store/chunkStore';
import { ChunkType } from '@mtypes/documents';
// import { MergeChunksToolProps, ToolResult } from '@features/chunk-shared/types';

export interface MergeChunksToolProps {
    chunk: ChunkType;
}
/**
 * Hook for merge chunks tool functionality
 */
export const useMergeChunks = () => {
    const handleMergeChunks = useChunkStore(state => state.mergeChunks);

    const mergeChunks = useCallback(async (props: MergeChunksToolProps): Promise<unknown> => {
        try {
            const { chunk } = props;
            await handleMergeChunks(chunk);
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
