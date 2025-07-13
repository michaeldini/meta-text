/**
 * @fileoverview Custom hook for MetaText Review data fetching
 * 
 * This hook encapsulates the data fetching logic for the MetaText Review page,
 * including loading states, error handling, and efficient data access.
 * Uses the MetaText detail data hook to avoid redundant chunk fetching.
 * 
 * @author MetaText Development Team
 * @version 2.0.0
 * @since 2025-07-09
 * @updated 2025-07-13 - Refactored to use MetaText detail data for chunks
 */

import { useEffect, useState } from 'react';
import { fetchWordlist, fetchPhraseExplanations, PhraseExplanation } from 'services';
import { ChunkType, FlashcardItem } from 'types';
import { log } from 'utils';
import { useMetaTextDetailData } from './useMetaTextDetailData';

/**
 * Hook return type interface
 */
interface UseMetaTextReviewDataReturn {
    /** Array of words for flashcard generation */
    wordlist: FlashcardItem[];
    /** Array of chunk summaries and notes */
    chunkSummariesNotes: ChunkType[];
    /** Array of phrase explanations */
    phraseExplanations: PhraseExplanation[];
    /** Loading state for data fetching operations */
    loading: boolean;
    /** Error message if data fetching fails */
    error: string | null;
}

/**
 * Custom hook for fetching MetaText Review data
 * 
 * Handles concurrent data fetching for wordlist, chunks, and phrase explanations
 * with proper loading states and error handling. Uses the MetaText detail data
 * to avoid redundant chunk fetching.
 * 
 * @param metatextId - The MetaText ID to fetch data for
 * @returns Object containing data, loading state, and error state
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { wordlist, chunkSummariesNotes, phraseExplanations, loading, error } = 
 *     useMetaTextReviewData(123);
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   
 *   return <div>Render data here</div>;
 * }
 * ```
 */
export function useMetaTextReviewData(metatextId?: number): UseMetaTextReviewDataReturn {
    /**
     * State management for wordlist data
     * Contains vocabulary words with definitions for flashcard generation
     */
    const [wordlist, setWordlist] = useState<FlashcardItem[]>([]);

    /**
     * State management for phrase explanations
     * Contains contextual explanations for important phrases in the document
     */
    const [phraseExplanations, setPhraseExplanations] = useState<PhraseExplanation[]>([]);

    /**
     * Additional loading state for data fetching operations not covered by detail hook
     */
    const [additionalLoading, setAdditionalLoading] = useState<boolean>(true);

    /**
     * Error state for handling and displaying fetch errors
     */
    const [error, setError] = useState<string | null>(null);

    // Use the MetaText detail data hook to get metaText and chunks
    const { metaText, loading: detailLoading, errors: detailErrors } = useMetaTextDetailData(metatextId);

    // Extract chunks from metaText
    const chunkSummariesNotes: ChunkType[] = metaText?.chunks || [];

    // Combined loading state
    const loading = detailLoading || additionalLoading;

    /**
     * Data loading effect for wordlist and phrase explanations
     * 
     * Fetches wordlist and phrase explanations concurrently while chunks
     * are obtained from the MetaText detail data.
     */
    useEffect(() => {
        /**
         * Async function to load wordlist and phrase explanations
         * 
         * Fetches wordlist and phrase explanations in parallel for optimal performance.
         * Chunks are now obtained from the MetaText detail data to avoid redundancy.
         */
        async function loadAdditionalData() {
            try {
                setAdditionalLoading(true);
                setError(null);
                log.info('Starting to load wordlist and phrase explanations', { metatextId });

                // Validate MetaText ID
                if (!metatextId || isNaN(metatextId)) {
                    setError('Invalid MetaText ID.');
                    setAdditionalLoading(false);
                    return;
                }

                // Fetch wordlist and phrase explanations concurrently
                log.info('Fetching wordlist...');
                const wordlistPromise = fetchWordlist(metatextId);

                log.info('Fetching phrase explanations...');
                const phraseExplanationsPromise = fetchPhraseExplanations(metatextId);

                const [wordlistData, phraseExplanationsData] = await Promise.all([
                    wordlistPromise,
                    phraseExplanationsPromise
                ]);

                // Validate and set data with fallbacks
                setWordlist(Array.isArray(wordlistData) ? wordlistData : []);
                setPhraseExplanations(Array.isArray(phraseExplanationsData) ? phraseExplanationsData : []);

            } catch (err) {
                setError('Failed to load wordlist or phrase explanations.');
                log.error('Failed to load wordlist or phrase explanations', err);
            } finally {
                setAdditionalLoading(false);
            }
        }

        if (metatextId) {
            loadAdditionalData();
        } else {
            setAdditionalLoading(false);
        }
    }, [metatextId]);

    // Handle errors from detail hook
    useEffect(() => {
        if (detailErrors.metaText) {
            setError(detailErrors.metaText);
        }
    }, [detailErrors.metaText]);

    return {
        wordlist,
        chunkSummariesNotes,
        phraseExplanations,
        loading,
        error
    };
}
