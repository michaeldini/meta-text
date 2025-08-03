// Hook for handling source document info generation
// Encapsulates loading, error, and handler logic for generating source document info

import { useState } from 'react';
import { generateSourceDocInfo } from '@services/aiService';
import log from '@utils/logger';
/**
 * Hook for handling source document info generation
 * Accepts a refetch function for the document detail, so the UI updates after generation.
 */
export function useGenerateSourceDocInfo(
    sourceDocumentId?: number | null,
    refetchDocument?: () => Promise<any>,
    onSuccess?: () => void
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        if (sourceDocumentId == null) return;
        setLoading(true);
        setError(null);
        try {
            log.info(`Generating source document info for ID ${sourceDocumentId}`);
            await generateSourceDocInfo(sourceDocumentId);
            if (refetchDocument) await refetchDocument();
            if (onSuccess) onSuccess();

        } catch (err: any) {
            setError(err.message || 'Failed to generate info');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleClick };
}
