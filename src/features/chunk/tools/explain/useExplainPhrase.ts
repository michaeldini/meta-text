import { useState, useCallback } from 'react';
import { apiPost } from '../../../../utils/api';

interface ToolResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface ExplainPhraseParams {
    phrase: string;
    context?: string;
    chunk?: any;
    meta_text_id?: string | number;
}

interface ExplainPhraseResult {
    explanation: string;
    explanationWithContext: string; // now always required
}

export function useExplainPhrase() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const explain = useCallback(
        async (params: ExplainPhraseParams): Promise<ToolResult<ExplainPhraseResult>> => {
            setLoading(true);
            setError(null);
            // Ensure meta_text_id is present, fallback to chunk.meta_text_id if available
            const meta_text_id = params.meta_text_id ?? params.chunk?.meta_text_id;
            const payload = { ...params, meta_text_id };
            try {
                const data = await apiPost<{
                    success: boolean;
                    data?: Partial<ExplainPhraseResult>;
                    error?: string;
                }>('/api/explain-phrase-in-context', payload);
                setLoading(false);
                if (!data.success) {
                    setError(data.error || 'Failed to explain phrase');
                }
                // Always provide explanationWithContext as a string
                if (data.data) {
                    return {
                        ...data,
                        data: {
                            explanation: data.data.explanation ?? '',
                            explanationWithContext: data.data.explanationWithContext ?? ''
                        }
                    };
                }
                return data as ToolResult<ExplainPhraseResult>;
            } catch (err: any) {
                setLoading(false);
                setError(err.message || 'Failed to explain phrase');
                return { success: false, error: err.message };
            }
        },
        []
    );

    return { explain, loading, error };
}
