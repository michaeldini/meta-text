import { useCallback } from 'react';
import * as chunkService from '../../../services/chunkService';

export function useChunksApi(metaTextId: number | string) {
    const fetchChunks = useCallback(() => chunkService.fetchChunks(Number(metaTextId)), [metaTextId]);

    const split = useCallback((chunkId: number, wordIndex: number) => chunkService.splitChunk(chunkId, wordIndex), []);

    const combine = useCallback((firstChunkId: number, secondChunkId: number) => chunkService.combineChunks(firstChunkId, secondChunkId), []);

    const update = useCallback((chunkId: number, text: any) => chunkService.updateChunk(chunkId, text), []);

    return { fetchChunks, split, combine, update };
}
