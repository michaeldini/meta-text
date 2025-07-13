// Custom hook to encapsulate data fetching and state logic for SourceDocDetailPage

import { useEffect } from 'react';
import { useSourceDocumentDetailStore } from 'store';

export function useSourceDocDetailData(sourceDocId?: number) {
    const store = useSourceDocumentDetailStore();
    const { doc, loading, error, refetch } = store;

    useEffect(() => {
        if (sourceDocId) {
            store.fetchSourceDocumentDetail(sourceDocId);
        } else {
            store.clearState();
        }
    }, [sourceDocId]);

    return { doc, loading, error, refetch };
}
