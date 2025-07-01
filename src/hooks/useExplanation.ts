import { useState } from 'react';
import { explainWordsOrChunk, ExplanationRequest, ExplanationResponse } from '../services/aiService';

export function useExplanation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);

    const explain = async (params: ExplanationRequest) => {
        setLoading(true);
        setError(null);
        setExplanation(null);
        try {
            const result = await explainWordsOrChunk(params);
            setExplanation(result);
            return result;
        } catch (err: any) {
            setError(err?.message || 'Failed to get explanation');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        explain,
        explanation,
        loading,
        error,
    };
}
