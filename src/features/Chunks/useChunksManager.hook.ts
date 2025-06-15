import { useCallback, useRef, useEffect, useState } from 'react';
import { useChunksApi } from './useChunksApi.hook';

function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export function useChunksManager(metaTextId: number) {
    const { split, combine, fetchChunks, update } = useChunksApi(metaTextId);
    const debounceMap = useRef<Record<string, any>>({});
    const [chunks, setChunks] = useState<any[]>([]);
    const [loadingChunks, setLoadingChunks] = useState(true);
    const [chunksError, setChunksError] = useState('');

    useEffect(() => {
        let isMounted = true;
        setLoadingChunks(true);
        setChunksError('');
        setChunks([]);
        if (!metaTextId) {
            setLoadingChunks(false);
            return;
        }
        fetchChunks()
            .then(chunkData => {
                if (!isMounted) return;
                setChunks(chunkData.map((chunk: any) => ({ ...chunk, content: chunk.text })));
            })
            .catch((e: any) => {
                if (!isMounted) return;
                setChunksError(e.message || 'Failed to load chunks.');
            })
            .finally(() => {
                if (!isMounted) return;
                setLoadingChunks(false);
            });
        return () => { isMounted = false; };
    }, [metaTextId, fetchChunks]);

    const handleWordClick = useCallback(async (chunkIdx: number, wordIdx: number) => {
        if (!chunks[chunkIdx] || !chunks[chunkIdx].id) return;
        await split(chunks[chunkIdx].id, wordIdx + 1);
        const updated = await fetchChunks();
        setChunks(updated.map((chunk: any) => ({ ...chunk, content: chunk.text })));
    }, [split, fetchChunks, chunks]);

    const handleRemoveChunk = useCallback(async (chunkIdx: number) => {
        const first = chunks[chunkIdx];
        const second = chunks[chunkIdx + 1];
        if (!first || !second) return;
        await combine(first.id, second.id);
        const updated = await fetchChunks();
        setChunks(updated.map((chunk: any) => ({ ...chunk, content: chunk.text })));
    }, [combine, fetchChunks, chunks]);

    const handleChunkFieldChange = useCallback((chunkIdx: number, field: string, value: any) => {
        setChunks(prevChunks => {
            const newChunks = [...prevChunks];
            newChunks[chunkIdx] = {
                ...newChunks[chunkIdx],
                [field]: value
            };
            const chunk = newChunks[chunkIdx];
            if (!debounceMap.current[chunk.id]) {
                debounceMap.current[chunk.id] = debounce((data: any) => {
                    update(data.id, data);
                }, 1200);
            }
            debounceMap.current[chunk.id]({ ...chunk, [field]: value });
            return newChunks;
        });
    }, [update]);

    const refetchChunks = useCallback(async () => {
        setLoadingChunks(true);
        setChunksError('');
        try {
            const chunkData = await fetchChunks();
            setChunks(chunkData.map((chunk: any) => ({ ...chunk, content: chunk.text })));
        } catch (e: any) {
            setChunksError(e.message || 'Failed to reload chunks.');
        } finally {
            setLoadingChunks(false);
        }
    }, [fetchChunks]);

    return {
        chunks,
        setChunks,
        loadingChunks,
        chunksError,
        handleWordClick,
        handleRemoveChunk,
        handleChunkFieldChange,
        refetchChunks,
    };
}
