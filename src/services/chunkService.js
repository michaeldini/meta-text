import handleApiResponse from '../utils/api';

export const getChunks = async (metaTextId) => {
    const res = await fetch(`/api/metatext/${metaTextId}/chunks`);
    return handleApiResponse(res);
};

export const splitChunk = async (chunkId, wordIndex) => {
    console.log(`ChunkService: Splitting chunk ${chunkId} at word index ${wordIndex}2`);
    const res = await fetch(`/api/chunk/${chunkId}/split?word_index=${wordIndex}`, { method: 'POST' });
    return handleApiResponse(res);
};

export const combineChunks = async (firstChunkId, secondChunkId) => {
    const res = await fetch(`/api/chunk/combine?first_chunk_id=${firstChunkId}&second_chunk_id=${secondChunkId}`, { method: 'POST' });
    return handleApiResponse(res);
};

export const updateChunk = async (chunkId, text) => {
    // Backend expects a plain string, not an object
    const res = await fetch(`/api/chunk/${chunkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(text) // send as a plain string
    });
    return handleApiResponse(res);
};