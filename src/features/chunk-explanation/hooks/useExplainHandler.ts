// Custom hook to handle both chunk and word explanations in a unified way
// Returns a handler function and state for use in UI components

import { useState, useCallback } from 'react';
import { explainWordsOrChunk, ExplanationRequest, ExplanationResponse } from 'services';


interface UseExplainHandlerOptions {
    onComplete?: (result: ExplanationResponse | null) => void;
}


export function useExplainHandler(options: UseExplainHandlerOptions) {
    const { onComplete } = options;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ExplanationResponse | null>(null);

    const handleExplain = useCallback(
        async (params: ExplanationRequest) => {
            setLoading(true);
            setError(null);
            setResult(null);
            try {
                const res = await explainWordsOrChunk(params);
                setResult(res);
                onComplete?.(res);
                return res;
            } catch (err: any) {
                setError(err?.message || 'Failed to get explanation');
                onComplete?.(null);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [onComplete]
    );

    return {
        handleExplain,
        loading,
        error,
        result,
    };
}

