// Hook relocated from pages/Metatext/hooks/useMetatextCreate
import { useState, useCallback } from 'react';
import { useAddMetatext } from '@features/documents/useDocumentsData';

export interface MetatextCreateData { title: string; sourceDocId: number | null; }
export interface UseMetatextCreateResult {
    title: string; loading: boolean; isSubmitDisabled: boolean;
    handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSourceDocChange: (value: string | null) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
export function useMetatextCreate(): UseMetatextCreateResult {
    const [data, setData] = useState<MetatextCreateData>({ title: '', sourceDocId: null });
    const mutation = useAddMetatext();
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setData(p => ({ ...p, title: e.target.value })); }, []);
    const handleSourceDocChange = useCallback((value: string | null) => { setData(p => ({ ...p, sourceDocId: value ? Number(value) : null })); }, []);
    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); if (!data.title.trim() || !data.sourceDocId) return; mutation.mutate({ sourceDocId: data.sourceDocId, title: data.title.trim() }, { onSuccess: () => setData({ title: '', sourceDocId: null }) }); }, [data, mutation]);
    const loading = mutation.isPending;
    const isSubmitDisabled = loading || !data.title.trim() || !data.sourceDocId;
    return { title: data.title, loading, isSubmitDisabled, handleTitleChange, handleSourceDocChange, handleSubmit };
}
