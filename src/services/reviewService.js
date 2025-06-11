import handleApiResponse from '../utils/api';
import logger from '../utils/logger';



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
