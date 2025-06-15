import handleApiResponse from '../utils/api';
import type { Chunk } from '../types/chunk';

export const fetchChunks = async (metaTextId: number): Promise<Chunk[]> => {
    const res = await fetch(`/api/chunks/all/${metaTextId}`);
    return handleApiResponse(res);
};

export const splitChunk = async (chunkId: number, wordIndex: number): Promise<Chunk[]> => {
    const res = await fetch(`/api/chunk/${chunkId}/split?word_index=${wordIndex}`, { method: 'POST' });
    return handleApiResponse(res);
};

export const combineChunks = async (firstChunkId: number, secondChunkId: number): Promise<Chunk[]> => {
    const res = await fetch(`/api/chunk/combine?first_chunk_id=${firstChunkId}&second_chunk_id=${secondChunkId}`, { method: 'POST' });
    return handleApiResponse(res);
};

export const updateChunk = async (chunkId: number, chunkData: Partial<Chunk>): Promise<Chunk> => {
    const res = await fetch(`/api/chunk/${chunkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chunkData)
    });
    return handleApiResponse(res);
};

export const fetchChunk = async (chunkId: number): Promise<Chunk> => {
    const res = await fetch(`/api/chunk/${chunkId}`);
    return handleApiResponse(res);
};
