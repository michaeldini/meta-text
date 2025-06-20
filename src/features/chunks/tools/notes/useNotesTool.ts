import { useCallback, useState } from 'react';
import { NotesToolProps, ToolResult } from '../types';

interface NotesResult {
    summary: string;
    notes: string;
}

/**
 * Hook for notes/summary tool functionality
 */
export const useNotesTool = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateNotes = useCallback(async (props: NotesToolProps): Promise<ToolResult<NotesResult>> => {
        setLoading(true);
        setError(null);

        try {
            const { userInput = '', chunk } = props;

            if (!chunk?.id) {
                throw new Error('Invalid chunk ID');
            }

            // For now, this is a simple pass-through since the actual update
            // happens through the chunk store. In the future, this could
            // include validation, auto-save, or AI enhancement

            return {
                success: true,
                data: {
                    summary: userInput,
                    notes: userInput
                }
            };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error updating notes';
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
        updateNotes,
        loading,
        error
    };
};
