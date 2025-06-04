import { useCallback } from 'react';
import { useChunks } from './useChunks';

/**
 * Custom hook for managing MetaText chunk handlers.
 * @param {string} metaTextId - The MetaText document ID.
 * @param {Function} setChunks - React setState function for chunks.
 * @returns {Object} Handlers for word click, remove chunk, and field change.
 */
export function useChunkHandlers(metaTextId, setChunks) {
    const { split, combine, fetchChunks, update } = useChunks(metaTextId);

    // Split chunk at word index using backend
    const handleWordClick = useCallback(async (chunkIdx, wordIdx) => {
        console.log(`Splitting chunk ${chunkIdx} at word index ${wordIdx}`);
        setChunks(prevChunks => {
            const currentChunk = prevChunks[chunkIdx];
            if (!currentChunk || !currentChunk.id) return prevChunks;
            // Optimistically update UI or show loading if desired
            return prevChunks;
        });
        // Get the chunk id directly from the latest state (not inside setChunks)
        // You should pass the current chunks as an argument to this handler for reliability
        // For now, let's assume you can access the latest chunks via a closure or prop
        // If not, refactor the component to pass the current chunks to this handler
        // Example fix:
        // (Assuming you can pass the current chunks as an argument)
        // const handleWordClick = useCallback(async (chunkIdx, wordIdx, chunks) => {
        //     const chunkId = chunks[chunkIdx]?.id;
        //     if (chunkId == null) return;
        //     ...
        // }, [split, fetchChunks, setChunks]);
        //
        // For now, fetch the latest chunks after the optimistic update
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

    // Field change remains local
    const handleChunkFieldChange = useCallback((chunkIdx, field, value) => {
        setChunks(prevChunks => {
            const newChunks = [...prevChunks];
            newChunks[chunkIdx] = {
                ...newChunks[chunkIdx],
                [field]: value
            };
            return newChunks;
        });
    }, [setChunks]);

    // Save all changed chunks to backend
    const saveAll = useCallback(async (chunks) => {
        // Save each chunk's text (future: also notes, summary, etc.)
        await Promise.all(
            chunks.map(chunk => update(chunk.id, chunk.content))
        );
        const updated = await fetchChunks();
        setChunks(updated.map(chunk => ({ ...chunk, content: chunk.text })));
    }, [update, fetchChunks, setChunks]);

    return {
        handleWordClick,
        handleRemoveChunk,
        handleChunkFieldChange,
        saveAll
    };
}
