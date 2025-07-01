import { useCallback } from 'react';
import { useChunkStore } from 'store';
import { SplitChunkToolProps, ToolResult } from '../types';

/**
 * Hook for split chunk tool functionality
 */
export const useSplitChunk = () => {
    const handleWordClick = useChunkStore(state => state.handleWordClick);

    const splitChunk = useCallback(async (props: SplitChunkToolProps): Promise<ToolResult> => {
        try {
            const { chunkIdx, wordIdx, word } = props;

            // Use the existing store function
            handleWordClick(chunkIdx, wordIdx);

            return {
                success: true,
                data: { chunkIdx, wordIdx, word }
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
