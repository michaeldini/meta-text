import { useState, useEffect, useCallback } from 'react';
import { fetchMetaTexts } from '../services/metaTextService';

export function useMetaTexts(deps = []) {
    const [metaTexts, setMetaTexts] = useState([]);
    const [metaTextsLoading, setMetaTextsLoading] = useState(true);
    const [metaTextsError, setMetaTextsError] = useState('');
    const [refreshIndex, setRefreshIndex] = useState(0);

    const refresh = useCallback(() => setRefreshIndex(i => i + 1), []);

    useEffect(() => {
        setMetaTextsLoading(true);
        setMetaTextsError('');
        fetchMetaTexts()
            .then(data => setMetaTexts(data)) // data is now [{id, title}]
            .catch(e => setMetaTextsError(e.message))
            .finally(() => setMetaTextsLoading(false));
    }, [...deps, refreshIndex]);

    return { metaTexts, metaTextsLoading, metaTextsError, refresh };
}
