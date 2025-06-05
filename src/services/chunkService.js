import handleApiResponse from '../utils/api';

export const fetchChunks = async (metaTextId) => {
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

export const updateChunk = async (chunkId, chunkData) => {
    // Backend expects a full chunk object (text, summary, notes, aiSummary, etc)
    const res = await fetch(`/api/chunk/${chunkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chunkData)
    });
    return handleApiResponse(res);
};