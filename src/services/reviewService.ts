import handleApiResponse from '../utils/api';
import logger from '../utils/logger';
import { fetchChunks } from './chunkService';

interface WordlistResponse {
    words: string[];
    meta_text_id: number;
    created_at?: string;
    [key: string]: unknown; // Allow for additional fields
}

export async function fetchWordlist(metaTextId: number): Promise<WordlistResponse> {
    try {
        const response = await fetch(`/api/metatext/${metaTextId}/wordlist`);
        const data = await handleApiResponse<WordlistResponse>(response);
        logger.info('Fetched wordlist', data);
        return data as WordlistResponse;
    } catch (error) {
        logger.error('Failed to fetch wordlist', error);
        throw error;
    }
}

export { fetchChunks as fetchChunkSummariesNotes };
