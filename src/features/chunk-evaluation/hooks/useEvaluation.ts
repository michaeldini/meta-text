import { useCallback, useState } from 'react';
import { generateEvaluation } from '@services/aiService';
import { ToolResult, EvaluationResult, EvaluationToolProps } from '@features/chunk-shared';
/**
 * Hook for evaluation tool functionality
 */
export const useEvaluation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvaluationResults = useCallback(async (props: EvaluationToolProps): Promise<ToolResult<EvaluationResult>> => {
        setLoading(true);
        setError(null);

        try {
            const { chunk } = props;

            if (!chunk?.id || typeof chunk.id !== 'number') {
                throw new Error('Invalid chunk ID');
            }

            const data = await generateEvaluation(chunk.id);
            const evaluationText = data.result || '';

            return {
                success: true,
                data: { evaluationText: evaluationText }
            };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error generating evaluation';
            setError(errorMessage);

            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        fetchEvaluationResults,
        loading,
        error
    };
};
