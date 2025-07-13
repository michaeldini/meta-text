import { apiGet } from '../utils/api';
import { withCache } from '../utils/cache';
import { log } from 'utils';

interface WordlistResponse {
    id: number;
    word: string[];
    context: string;
    definition: string;
    definition_with_context: string;
    meta_text_id: number;
    created_at: string;
}

// Base function without caching
async function _fetchWordlist(metatextId: number): Promise<WordlistResponse> {
    try {
        return await apiGet<WordlistResponse>(`/api/metatext/${metatextId}/wordlist`);
    } catch (error) {
        log.error('Failed to fetch wordlist', error);
        throw error;
    }
}

// Cached version (5 minutes for wordlists)
export const fetchWordlist = withCache(
    'fetchWordlist',
    _fetchWordlist,
    5 * 60 * 1000 // 5 minutes
);

export interface PhraseExplanation {
    id: number;
    phrase: string;
    context: string;
    explanation: string;
    explanation_with_context: string;
    meta_text_id: number | null;
}


async function _fetchPhraseExplanations(metatextId: number): Promise<PhraseExplanation[]> {
    try {
        const data = await apiGet<PhraseExplanation[]>(`/api/metatext/${metatextId}/explanations`);
        return data;
    } catch (error) {
        log.error('Failed to fetch phrase explanations', error);
        throw error;
    }
}

export const fetchPhraseExplanations = withCache(
    'fetchPhraseExplanations',
    _fetchPhraseExplanations,
    5 * 60 * 1000 // 5 minutes
);
