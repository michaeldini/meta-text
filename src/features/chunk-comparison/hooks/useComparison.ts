import { useCallback, useState } from 'react';
import { generateChunkNoteSummaryTextComparison } from 'services';
import { ToolResult, ComparisonResult, ComparisonToolProps } from 'features/chunk-shared/types';
/**
 * Hook for comparison tool functionality
 */
export const useComparison = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateComparison = useCallback(async (props: ComparisonToolProps): Promise<ToolResult<ComparisonResult>> => {
        setLoading(true);
        setError(null);

        try {
            const { chunk } = props;

            if (!chunk?.id || typeof chunk.id !== 'number') {
                throw new Error('Invalid chunk ID');
            }

            const data = await generateChunkNoteSummaryTextComparison(chunk.id);
            const comparisonText = data.result || '';

            return {
                success: true,
                data: { comparisonText }
            };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error generating comparison';
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
        generateComparison,
        loading,
        error
    };
};
