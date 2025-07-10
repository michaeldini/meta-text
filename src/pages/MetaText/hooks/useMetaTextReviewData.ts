/**
 * @fileoverview Custom hook for MetaText Review data fetching
 * 
 * This hook encapsulates all the data fetching logic for the MetaText Review page,
 * including loading states, error handling, and concurrent data fetching.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-09
 */

import { useEffect, useState } from 'react';
import { fetchWordlist, fetchChunks, fetchPhraseExplanations, PhraseExplanation } from 'services';
import { ChunkType, WordlistRow } from 'types';
import { log } from 'utils';

/**
 * Hook return type interface
 */
interface UseMetaTextReviewDataReturn {
    /** Array of words for flashcard generation */
    wordlist: WordlistRow[];
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
 * with proper loading states and error handling.
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
    const [wordlist, setWordlist] = useState<WordlistRow[]>([]);

    /**
     * State management for chunk summaries and notes
     * Contains processed chunks with summaries and analysis notes
     */
    const [chunkSummariesNotes, setChunkSummariesNotes] = useState<ChunkType[]>([]);

    /**
     * State management for phrase explanations
     * Contains contextual explanations for important phrases in the document
     */
    const [phraseExplanations, setPhraseExplanations] = useState<PhraseExplanation[]>([]);

    /**
     * Loading state for data fetching operations
     */
    const [loading, setLoading] = useState<boolean>(true);

    /**
     * Error state for handling and displaying fetch errors
     */
    const [error, setError] = useState<string | null>(null);

    /**
     * Data loading effect
     * 
     * Fetches all required data concurrently when the component mounts or
     * when the MetaText ID changes. Handles loading states, error conditions,
     * and data validation.
     */
    useEffect(() => {
        /**
         * Async function to load all review data concurrently
         * 
         * Fetches wordlist, chunk data, and phrase explanations in parallel
         * for optimal performance. Includes comprehensive error handling
         * and data validation.
         */
        async function loadData() {
            try {
                setLoading(true);
                setError(null);
                log.info('Starting to load wordlist and chunk summaries/notes', { metatextId });

                // Validate MetaText ID
                if (!metatextId || isNaN(metatextId)) {
                    setError('Invalid MetaText ID.');
                    setLoading(false);
                    return;
                }

                // Fetch all data concurrently for better performance
                log.info('Fetching wordlist...');
                const wordlistPromise = fetchWordlist(metatextId);

                log.info('Fetching chunk summaries/notes...');
                const chunkPromise = fetchChunks(metatextId);

                log.info('Fetching phrase explanations...');
                const phraseExplanationsPromise = fetchPhraseExplanations(metatextId);

                const [wordlistData, chunkData, phraseExplanationsData] = await Promise.all([
                    wordlistPromise,
                    chunkPromise,
                    phraseExplanationsPromise
                ]);

                // Validate and set data with fallbacks
                setWordlist(Array.isArray(wordlistData) ? wordlistData : []);
                setChunkSummariesNotes(Array.isArray(chunkData) ? chunkData : []);
                setPhraseExplanations(Array.isArray(phraseExplanationsData) ? phraseExplanationsData : []);

            } catch (err) {
                setError('Failed to load wordlist or chunk summaries/notes.');
                log.error('Failed to load wordlist or chunk summaries/notes', err);
            } finally {
                setLoading(false);
            }
        }

        if (metatextId) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [metatextId]);

    return {
        wordlist,
        chunkSummariesNotes,
        phraseExplanations,
        loading,
        error
    };
}
