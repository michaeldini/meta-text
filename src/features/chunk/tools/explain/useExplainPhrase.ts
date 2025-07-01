import { useState, useCallback } from 'react';
import { apiPost } from '../../../../utils/api';

interface ExplainPhraseParams {
    phrase: string;
    context?: string;
    chunk?: any;
    meta_text_id?: string | number;
}

export interface ExplainPhraseResult {
    explanation: string;
    explanationWithContext: string;
}

export function useExplainPhrase() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const explain = useCallback(
        async (params: ExplainPhraseParams): Promise<ExplainPhraseResult | null> => {
            setLoading(true);
            setError(null);
            const meta_text_id = params.meta_text_id ?? params.chunk?.meta_text_id;
            const payload = { ...params, meta_text_id };
            try {
                const data = await apiPost<any>('/api/explain-phrase-in-context', payload);
                setLoading(false);
                // Handle direct explanation object
                if (data && (data.explanation || data.explanationWithContext)) {
                    return {
                        explanation: data.explanation ?? '',
                        explanationWithContext: data.explanationWithContext ?? ''
                    };
                }
                // Handle error
                setError(data?.error || 'Failed to explain phrase');
                return null;
            } catch (err: any) {
                setLoading(false);
                setError(err.message || 'Failed to explain phrase');
                return null;
            }
        },
        []
    );

    return { explain, loading, error };
}
