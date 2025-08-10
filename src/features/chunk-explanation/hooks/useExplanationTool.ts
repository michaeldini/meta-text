// Custom hook to encapsulate business logic for ExplanationTool (chunk explanation)
// Returns all state and handlers needed by the presentational component

import { useCallback } from 'react';
import { useExplainHandler } from './useExplainHandler';
import type { ChunkType } from '@mtypes/documents';

export function useExplanationTool(chunk: ChunkType, mutateChunkField: any) {
    const { handleExplain, loading, error } = useExplainHandler();

    const handleGenerate = useCallback(async () => {
        if (!chunk?.id) return;
        const res = await handleExplain({
            words: '',
            context: chunk.text,
            metatext_id: null,
            chunk_id: chunk.id,
        });
        if (res && chunk?.id) {
            mutateChunkField({ chunkId: chunk.id, field: 'explanation', value: res.explanation });
        }
    }, [chunk, handleExplain]);

    return {
        loading,
        error,
        handleGenerate,
    };
}
