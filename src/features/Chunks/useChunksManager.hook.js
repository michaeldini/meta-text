import { useCallback, useRef, useEffect, useState } from 'react';
import { useChunksApi } from './useChunksApi.hook.';

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Custom hook for managing MetaText chunk handlers and state.
 * @param {string} metaTextId - The MetaText document ID.
 * @returns {Object} Chunks state, loading, errors, handlers, etc.
 */
export function useChunksManager(metaTextId) {
    console.log('useChunksManager render, metaTextId:', metaTextId);
    const { split, combine, fetchChunks, update } = useChunksApi(metaTextId);
    const debounceMap = useRef({});
    const [chunks, setChunks] = useState([]);
    const [loadingChunks, setLoadingChunks] = useState(true);
    const [chunksError, setChunksError] = useState('');

    // Fetch chunks on mount or metaTextId change
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
                setChunks(chunkData.map(chunk => ({ ...chunk, content: chunk.text })));
            })
            .catch(e => {
                if (!isMounted) return;
                setChunksError(e.message || 'Failed to load chunks.');
            })
            .finally(() => {
                if (!isMounted) return;
                setLoadingChunks(false);
            });
        return () => { isMounted = false; };
    }, [metaTextId, fetchChunks]);

    // Split chunk at word index using backend
    const handleWordClick = useCallback(async (chunkIdx, wordIdx) => {
        if (!chunks[chunkIdx] || !chunks[chunkIdx].id) return;
        await split(chunks[chunkIdx].id, wordIdx + 1);
        const updated = await fetchChunks();
        setChunks(updated.map(chunk => ({ ...chunk, content: chunk.text })));
    }, [split, fetchChunks, chunks]);

    // Combine chunk with next using backend
    const handleRemoveChunk = useCallback(async (chunkIdx) => {
        const first = chunks[chunkIdx];
        const second = chunks[chunkIdx + 1];
        if (!first || !second) return;
        await combine(first.id, second.id);
        const updated = await fetchChunks();
        setChunks(updated.map(chunk => ({ ...chunk, content: chunk.text })));
    }, [combine, fetchChunks, chunks]);

    // Field change: update local and save to backend (debounced)
    const handleChunkFieldChange = useCallback((chunkIdx, field, value) => {
        setChunks(prevChunks => {
            const newChunks = [...prevChunks];
            newChunks[chunkIdx] = {
                ...newChunks[chunkIdx],
                [field]: value
            };
            // Debounced save for this chunk
            const chunk = newChunks[chunkIdx];
            if (!debounceMap.current[chunk.id]) {
                debounceMap.current[chunk.id] = debounce((data) => {
                    update(data.id, data);
                }, 1200);
            }
            debounceMap.current[chunk.id]({ ...chunk, [field]: value });
            return newChunks;
        });
    }, [update]);

    // Expose refetchChunks for manual reload
    const refetchChunks = useCallback(async () => {
        setLoadingChunks(true);
        setChunksError('');
        try {
            const chunkData = await fetchChunks();
            setChunks(chunkData.map(chunk => ({ ...chunk, content: chunk.text })));
        } catch (e) {
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
