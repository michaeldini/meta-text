
// React Query-based hook for fetching Metatext review data
import { useQuery } from '@tanstack/react-query';
import { fetchReviewData } from 'services';
import { ChunkType, Explanation } from 'types';
import { useChunkStore } from 'store/chunkStore';
import { log } from 'utils';


interface UseMetatextReviewDataReturn {
    wordList: Explanation[];
    phraseList: Explanation[];
    chunks: ChunkType[];
    loading: boolean;
    error: string | null;
}

export function useMetatextReviewData(metatextId?: number): UseMetatextReviewDataReturn {
    const chunks = useChunkStore((state) => state.chunks);

    const {
        data,
        isLoading,
        error
    } = useQuery<{ wordList: Explanation[]; phraseList: Explanation[] }, Error>({
        queryKey: ['metatextReview', metatextId],
        queryFn: async () => {
            if (!metatextId) throw new Error('Metatext ID is required to load review data.');
            const reviewData = await fetchReviewData(metatextId);
            return {
                wordList: reviewData.word_list,
                phraseList: reviewData.phrase_list
            };
        },
        enabled: !!metatextId,
        retry: 1,
        staleTime: 1000 * 60 // 1 minute
    });

    return {
        wordList: data ? data.wordList : [],
        phraseList: data ? data.phraseList : [],
        chunks,
        loading: isLoading,
        error: error ? error.message : null
    };
}
