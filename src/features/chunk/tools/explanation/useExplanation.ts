import { useCallback, useState } from 'react';
import { generateChunkExplanation } from '../../../../services/aiService';
import { ComparisonToolProps, ToolResult } from '../types';

interface ExplanationResult {
    explanationText: string;
}

/**
 * Hook for explanation tool functionality
 */
export const useExplanation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateExplanation = useCallback(async (props: ComparisonToolProps): Promise<ToolResult<ExplanationResult>> => {
        setLoading(true);
        setError(null);
        try {
            const { chunk } = props;
            if (!chunk?.id || typeof chunk.id !== 'number') {
                throw new Error('Invalid chunk ID');
            }
            const data = await generateChunkExplanation(chunk.id);
            const explanationText = data.explanation || '';
            return {
                success: true,
                data: { explanationText }
            };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error generating explanation';
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    }, []);

    return { generateExplanation, loading, error };
};
