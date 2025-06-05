import { useCallback, useRef } from 'react';
import { useChunks } from './useChunks';

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Custom hook for managing MetaText chunk handlers.
 * @param {string} metaTextId - The MetaText document ID.
 * @param {Function} setChunks - React setState function for chunks.
 * @returns {Object} Handlers for word click, remove chunk, and field change.
 */
export function useChunkHandlers(metaTextId, setChunks) {
    const { split, combine, fetchChunks, update } = useChunks(metaTextId);
    const debounceMap = useRef({});

    // Split chunk at word index using backend
    const handleWordClick = useCallback(async (chunkIdx, wordIdx) => {
        console.log(`Splitting chunk ${chunkIdx} at word index ${wordIdx}`);
        setChunks(prevChunks => {
            const currentChunk = prevChunks[chunkIdx];
            if (!currentChunk || !currentChunk.id) return prevChunks;
            return prevChunks;
        });
        const updatedChunks = await fetchChunks();
        const chunkId = updatedChunks[chunkIdx]?.id;
        if (chunkId == null) return;
        console.log(`UseMetaTextSectionHandlers: Calling split for chunk ${chunkId} at word index ${wordIdx}`);
        await split(chunkId, wordIdx + 1);
        const updated = await fetchChunks();
        setChunks(updated.map(chunk => ({
            ...chunk,
            content: chunk.text
        })));
    }, [split, fetchChunks, setChunks]);

    // Combine chunk with next using backend
    const handleRemoveChunk = useCallback(async (chunkIdx, chunks) => {
        const first = chunks[chunkIdx];
        const second = chunks[chunkIdx + 1];
        if (!first || !second) return;
        await combine(first.id, second.id);
        const updated = await fetchChunks();
        setChunks(updated.map(chunk => ({
            ...chunk,
            content: chunk.text
        })));
    }, [combine, fetchChunks, setChunks]);

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
                // Increased debounce interval for smoother typing experience
                debounceMap.current[chunk.id] = debounce((data) => {
                    update(data.id, data);
                }, 1200); // was 500ms, now 1200ms
            }
            debounceMap.current[chunk.id]({ ...chunk, [field]: value });
            return newChunks;
        });
    }, [setChunks, update]);


    return {
        handleWordClick,
        handleRemoveChunk,
        handleChunkFieldChange,

    };
}
