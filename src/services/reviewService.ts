import { api } from '../utils/ky';
import { log } from 'utils';
import type { Explanation } from 'types';


export interface ReviewResponse {
    word_list: Explanation[];
    phrase_list: Explanation[];
}

// Fetch all review data (wordlist + phrase explanations)
export async function fetchReviewData(metatextId: number): Promise<ReviewResponse> {
    try {
        return await api.get(`metatext/${metatextId}/review`).json<ReviewResponse>();
    } catch (error) {
        log.error('Failed to fetch review data', error);
        throw error;
    }
}

