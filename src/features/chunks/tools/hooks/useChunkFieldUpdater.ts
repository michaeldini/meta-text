import { useChunkStore } from '../../../../store/chunkStore';
import type { Chunk } from '../../../../types/chunk';
import { useCallback } from 'react';

export function useChunkFieldUpdater() {
    const { updateChunkField } = useChunkStore();
    // Memoize the updater to avoid unnecessary re-renders
    const setField = useCallback((chunkId: number, field: keyof Chunk, value: any) => {
        updateChunkField(chunkId, field, value);
    }, [updateChunkField]);
    return setField;
}
