import { useCallback } from 'react';
import { useChunkStore } from '@store/chunkStore';
import { SplitChunkToolProps, ToolResult } from '@features/chunk-shared/types';

/**
 * Hook for split chunk tool functionality
 */
export const useSplitChunk = () => {
    const handleWordClick = useChunkStore(state => state.handleWordClick);

    const splitChunk = useCallback(async (props: SplitChunkToolProps): Promise<ToolResult> => {
        try {
            const { chunkId, chunkIdx, wordIdx, word } = props;

            // Use the existing store function
            await handleWordClick(chunkId, chunkIdx, wordIdx);

            return {
                success: true,
                data: { chunkId, chunkIdx, wordIdx, word }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to split chunk'
            };
        }
    }, [handleWordClick]);

    return {
        splitChunk
    };
};
