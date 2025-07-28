// Hook for handling source document info generation
// Encapsulates loading, error, and handler logic for generating source document info

import { useState } from 'react';
import { generateSourceDocInfo } from 'services';
import { useSourceDocuments } from 'features/documents/useDocumentsData';

export function useGenerateSourceDocInfo(sourceDocumentId?: number | null, onSuccess?: () => void) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { refetch: refetchSourceDocs } = useSourceDocuments();

    const handleClick = async () => {
        if (sourceDocumentId == null) return;
        setLoading(true);
        setError(null);
        try {
            await generateSourceDocInfo(sourceDocumentId);
            await refetchSourceDocs();
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to generate info');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleClick };
}
