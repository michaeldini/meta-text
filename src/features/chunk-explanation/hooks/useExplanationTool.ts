// Custom hook to encapsulate business logic for ExplanationTool (chunk explanation)
// Returns all state and handlers needed by the presentational component

import { useCallback } from 'react';
import { useExplainHandler } from './useExplainHandler';
import type { ChunkType, UpdateChunkFieldFn } from 'types';

export function useExplanationTool(chunk: ChunkType, updateChunkField: UpdateChunkFieldFn) {
    const { handleExplain, loading, error } = useExplainHandler({
        onComplete: (result) => {
            if (result && chunk?.id) {
                updateChunkField(chunk.id, 'explanation', result.explanation);
            }
        },
    });

    const handleGenerate = useCallback(async () => {
        if (!chunk?.id) return;
        await handleExplain({
            words: '',
            context: chunk.text,
            metatext_id: null,
            chunk_id: chunk.id,
        });
    }, [chunk, handleExplain]);

    return {
        loading,
        error,
        handleGenerate,
    };
}
