import { useCallback, useState } from 'react';
import { fetchDefinitionInContext } from 'services';
import { DefineWordToolProps, ToolResult } from '../types';

interface DefinitionResult {
    definition: string;
    definitionWithContext: string;
}

/**
 * Hook for define word tool functionality
 */
export const useDefineWord = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const defineWord = useCallback(async (props: DefineWordToolProps): Promise<ToolResult<DefinitionResult>> => {
        setLoading(true);
        setError(null);

        try {
            const { word, context = '', chunk } = props;

            if (!chunk?.meta_text_id || typeof chunk.meta_text_id !== 'number') {
                throw new Error('Invalid meta text ID');
            }

            const result = await fetchDefinitionInContext(word, context, chunk.meta_text_id);

            return {
                success: true,
                data: result
            };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch definition';
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
        defineWord,
        loading,
        error
    };
};
