import handleApiResponse from '../utils/api';
import logger from '../utils/logger';
import { fetchChunks } from './chunkService';



export async function fetchWordlist(metaTextId) {
    try {
        const response = await fetch(`/api/metatext/${metaTextId}/wordlist`);
        const data = await handleApiResponse(response);
        logger.info('Fetched wordlist', data);
        return data;
    } catch (error) {
        logger.error('Failed to fetch wordlist', error);
        throw error;
    }
}

// Re-export fetchChunks for review use
export { fetchChunks as fetchChunkSummariesNotes };
