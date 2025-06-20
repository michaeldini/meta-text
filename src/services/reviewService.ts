import { handleApiResponse } from '../utils/api';
import { withCache } from '../utils/cache';
import logger from '../utils/logger';

interface WordlistResponse {
    words: string[];
    meta_text_id: number;
    created_at?: string;
    [key: string]: unknown; // Allow for additional fields
}

// Base function without caching
async function _fetchWordlist(metaTextId: number): Promise<WordlistResponse> {
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

// Cached version (5 minutes for wordlists)
export const fetchWordlist = withCache(
    'fetchWordlist',
    _fetchWordlist,
    5 * 60 * 1000 // 5 minutes
);
