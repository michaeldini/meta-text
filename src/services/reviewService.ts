import { apiGet } from '../utils/api';
import { withCache } from '../utils/cache';
import { log } from 'utils';
import type { Explanation } from 'types';


export interface ReviewResponse {
    word_list: Explanation[];
    phrase_list: Explanation[];
}

// Base function for fetching all review data (wordlist + phrase explanations)
async function _fetchReviewData(metatextId: number): Promise<ReviewResponse> {
    try {
        return await apiGet<ReviewResponse>(`/api/metatext/${metatextId}/review`);
    } catch (error) {
        log.error('Failed to fetch review data', error);
        throw error;
    }
}

// Cached version (5 minutes for review data)
export const fetchReviewData = withCache(
    'fetchReviewData',
    _fetchReviewData,
    5 * 60 * 1000 // 5 minutes
);

