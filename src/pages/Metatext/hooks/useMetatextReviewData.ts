/**
 * @fileoverview Custom hook for Metatext Review data fetching
 * 
 * This hook encapsulates the data fetching logic for the Metatext Review page,
 * including loading states, error handling, and efficient data access.
 * Uses the Metatext detail data hook to avoid redundant chunk fetching.
 * 
 * @author Metatext Development Team
 * @version 2.0.0
 * @since 2025-07-09
 * @updated 2025-07-13 - Refactored to use Metatext detail data for chunks
 */

import { useEffect, useState } from 'react';
import { fetchReviewData } from 'services';
import { ChunkType, Explanation } from 'types';
import { log } from 'utils';
import { useChunkStore } from 'store/chunkStore';

/**
 * Hook return type interface
 */
interface UseMetatextReviewDataReturn {
    wordList: Explanation[];
    phraseList: Explanation[];
    chunks: ChunkType[];
    loading: boolean;
    error: string | null;
}


export function useMetatextReviewData(metatextId?: number): UseMetatextReviewDataReturn {
    const [wordList, setWordList] = useState<Explanation[]>([]);
    const [phraseList, setPhraseList] = useState<Explanation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Get chunks from the global chunk store
    const chunks = useChunkStore((state) => state.chunks);



    useEffect(() => {
        setLoading(true);
        async function loadReviewData() {
            try {
                setError(null);
                log.info('Starting to load review data', { metatextId });

                if (!metatextId) {
                    setError('Metatext ID is required to load review data.');
                    return;
                }
                // Fetch review data (wordList and phraseList)
                const reviewData = await fetchReviewData(metatextId);

                setWordList(Array.isArray(reviewData.word_list) ? reviewData.word_list : []);
                setPhraseList(Array.isArray(reviewData.phrase_list) ? reviewData.phrase_list : []);

            } catch (err) {
                setError('Failed to load review data.');
                log.error('Failed to load review data', err);
            } finally {
                setLoading(false);
            }
        }

        if (metatextId) {
            loadReviewData();
        } else {
            setLoading(false);
        }
    }, [metatextId]);



    return {
        wordList,
        chunks,
        phraseList,
        loading,
        error
    };
}
