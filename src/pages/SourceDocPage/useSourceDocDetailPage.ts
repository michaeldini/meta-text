import { useEffect } from 'react';
import { useSourceDocumentDetailStore } from 'store';

// Custom hook to encapsulate data fetching and state logic for SourceDocDetailPage
export function useSourceDocDetailPage(sourceDocId?: string) {
    const store = useSourceDocumentDetailStore();
    const { doc, loading, error, refetch } = store;

    useEffect(() => {
        if (sourceDocId) {
            store.fetchSourceDocumentDetail(sourceDocId);
        } else {
            store.clearState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceDocId]);

    return { doc, loading, error, refetch };
}
