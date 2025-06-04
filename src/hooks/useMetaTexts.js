import { useState, useEffect, useCallback } from 'react';
import { fetchMetaTexts } from '../services/metaTextService';

export function useMetaTexts(deps = []) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshIndex, setRefreshIndex] = useState(0);

    const refresh = useCallback(() => setRefreshIndex(i => i + 1), []);

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchMetaTexts()
            .then(data => setData(data))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [...deps, refreshIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    return { data, loading, error, refresh };
}
