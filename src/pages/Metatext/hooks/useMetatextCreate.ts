// Minimal hook for Metatext creation form state and submit
import { useState, useCallback } from 'react';
import { useAddMetatext } from '@features/documents/useDocumentsData';



// Form data structure for Metatext creation
export interface MetatextCreateData {
    title: string;
    sourceDocId: number | null;
}

// Return type for the useMetatextCreate hook
export interface UseMetatextCreateResult {
    title: string;
    sourceDocId: number | null;
    loading: boolean;
    isSubmitDisabled: boolean;
    handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSourceDocChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function useMetatextCreate(): UseMetatextCreateResult {
    // Form state
    const [data, setData] = useState<MetatextCreateData>({ title: '', sourceDocId: null });
    const mutation = useAddMetatext();

    // Handlers
    const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ ...prev, title: event.target.value }));
    }, []);

    const handleSourceDocChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setData(prev => ({ ...prev, sourceDocId: value ? Number(value) : null }));
    }, []);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!data.title.trim() || !data.sourceDocId) return;
        mutation.mutate({ sourceDocId: data.sourceDocId, title: data.title.trim() }, {
            onSuccess: () => setData({ title: '', sourceDocId: null })
        });
    }, [data, mutation]);

    const loading = mutation.isPending;
    const isSubmitDisabled = loading || !data.title.trim() || !data.sourceDocId;

    return {
        title: data.title,
        sourceDocId: data.sourceDocId,
        loading,
        isSubmitDisabled,
        handleTitleChange,
        handleSourceDocChange,
        handleSubmit,
    };
}
