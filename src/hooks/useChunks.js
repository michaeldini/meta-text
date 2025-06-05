import { useCallback } from 'react';
import * as chunkService from '../services/chunkService';

export function useChunks(metaTextId) {
    const fetchChunks = useCallback(() => chunkService.fetchChunks(metaTextId), [metaTextId]);

    const split = useCallback((chunkId, wordIndex) => chunkService.splitChunk(chunkId, wordIndex), []);

    const combine = useCallback((firstChunkId, secondChunkId) => chunkService.combineChunks(firstChunkId, secondChunkId), []);

    const update = useCallback((chunkId, text) => chunkService.updateChunk(chunkId, text), []);

    return { fetchChunks, split, combine, update };
}