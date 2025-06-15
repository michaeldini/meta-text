import { useState, useEffect, useCallback } from 'react';
import { fetchMetaTexts } from '../services/metaTextService';
import type { MetaText } from '../types/metaText';

export function useMetaTexts(deps: any[] = []) {
    const [metaTexts, setMetaTexts] = useState<MetaText[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshIndex, setRefreshIndex] = useState(0);

    const refresh = useCallback(() => setRefreshIndex(i => i + 1), []);

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchMetaTexts()
            .then((data: MetaText[]) => setMetaTexts(data))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [...deps, refreshIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        metaTexts,
        metaTextsLoading: loading,
        metaTextsError: error,
        refresh
    };
}
