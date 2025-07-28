/**
 * Custom hook for SourceDocUploadForm logic.
 * Handles:
 *  - Local state for title, file, error
 *  - React Query mutation for upload
 *  - Handlers for title, file, and submit
 * Returns all props and handlers needed for the upload form.
 */
import { useState, useCallback } from 'react';
import { useAddSourceDocument } from 'features';

export function useSourceDocUploadForm(onSuccess: () => void) {
    // Local state for form fields
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    // React Query mutation for upload
    const addSourceDocument = useAddSourceDocument();

    // Handlers
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        if (error) setError(null);
    };

    // Inline handler for file change
    const handleFileChange = (file: File | null) => {
        if (file) {
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            if (fileExtension !== '.txt') {
                setError('Only .txt files are allowed');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }
        }
        setFile(file);
        if (error) setError(null);
    };

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        if (!title.trim()) {
            setError('Title is required.');
            return;
        }
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        addSourceDocument.mutate(
            { title: title.trim(), file },
            {
                onSuccess: () => {
                    setTitle('');
                    setFile(null);
                    if (onSuccess) onSuccess();
                },
                onError: () => {
                    setError('Failed to upload document.');
                },
            }
        );
    }, [title, file, addSourceDocument, onSuccess]);

    return {
        title,
        setTitle,
        file,
        setFile,
        error,
        setError,
        addSourceDocument,
        handleTitleChange,
        handleFileChange,
        handleSubmit,
    };
}
