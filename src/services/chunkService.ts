import handleApiResponse from '../utils/api';
import type { Chunk } from '../types/chunk';

export const fetchChunks = async (metaTextId: number): Promise<Chunk[]> => {
    const res = await fetch(`/api/chunks/all/${metaTextId}`);
    const data = await handleApiResponse(res);
    if (data === true) return [];
    return data;
};

export const splitChunk = async (chunkId: number, wordIndex: number): Promise<Chunk[]> => {
    const res = await fetch(`/api/chunk/${chunkId}/split?word_index=${wordIndex}`, { method: 'POST' });
    const data = await handleApiResponse(res);
    if (data === true) return [];
    return data;
};

export const combineChunks = async (firstChunkId: number, secondChunkId: number): Promise<Chunk | null> => {
    const res = await fetch(`/api/chunk/combine?first_chunk_id=${firstChunkId}&second_chunk_id=${secondChunkId}`, { method: 'POST' });
    const data = await handleApiResponse(res);
    if (data === true) return null;
    return data;
};

export const updateChunk = async (chunkId: number, chunkData: Partial<Chunk>): Promise<Chunk> => {
    const res = await fetch(`/api/chunk/${chunkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chunkData)
    });
    const data = await handleApiResponse(res);
    if (data === true) {
        throw new Error('Failed to update chunk');
    }
    return data;
};

export const fetchChunk = async (chunkId: number): Promise<Chunk> => {
    const res = await fetch(`/api/chunk/${chunkId}`);
    const data = await handleApiResponse(res);
    if (data === true) {
        throw new Error('Failed to fetch chunk');
    }
    return data;
};
