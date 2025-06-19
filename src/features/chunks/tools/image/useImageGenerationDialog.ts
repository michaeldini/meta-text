import { useState, useCallback } from 'react';

export interface UseImageGenerationDialog {
    dialogOpen: boolean;
    loading: boolean;
    error: string | null;
    prompt: string;
    openDialog: () => void;
    closeDialog: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setPrompt: (prompt: string) => void;
    handlePromptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (onSubmit: (prompt: string) => void) => (e: React.FormEvent<HTMLFormElement>) => void;
}

export function useImageGenerationDialog(): UseImageGenerationDialog {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');

    const openDialog = useCallback(() => {
        setDialogOpen(true);
        setError(null);
        setPrompt('');
    }, []);

    const closeDialog = useCallback(() => {
        setDialogOpen(false);
        setError(null);
        setPrompt('');
    }, []);

    const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(e.target.value);
    }, []);

    const handleSubmit = (onSubmit: (prompt: string) => void) => (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(prompt);
    };

    return {
        dialogOpen,
        loading,
        error,
        prompt,
        openDialog,
        closeDialog,
        setLoading,
        setError,
        setPrompt,
        handlePromptChange,
        handleSubmit,
    };
}
