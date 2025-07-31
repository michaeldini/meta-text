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
    // Local state for batch upload
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    // Track upload status for each file
    const [uploadStatuses, setUploadStatuses] = useState<{
        uploading: boolean;
        success: boolean;
        error: string | null;
    }[]>([]);

    // React Query mutation for upload (single file)
    const addSourceDocument = useAddSourceDocument();

    // Simulate a batch mutation wrapper (simple version)
    const addSourceDocuments = {
        isPending: uploadStatuses.length > 0 && uploadStatuses.some(s => s.uploading),
        mutate: (fileList: File[], callbacks: { onSuccess?: () => void; onError?: () => void }) => {
            setUploadStatuses(fileList.map(() => ({ uploading: true, success: false, error: null })));
            let completed = 0;
            let anyError = false;
            fileList.forEach((file, idx) => {
                addSourceDocument.mutate(
                    { title: file.name.replace(/\.[^.]+$/, ''), file },
                    {
                        onSuccess: () => {
                            setUploadStatuses(prev => {
                                const next = [...prev];
                                next[idx] = { ...next[idx], uploading: false, success: true, error: null };
                                return next;
                            });
                            completed++;
                            if (completed === fileList.length) {
                                // All uploads finished, force all uploading: false
                                setUploadStatuses(prev => prev.map(s => ({ ...s, uploading: false })));
                                if (anyError && callbacks.onError) callbacks.onError();
                                else if (callbacks.onSuccess) callbacks.onSuccess();
                            }
                        },
                        onError: () => {
                            setUploadStatuses(prev => {
                                const next = [...prev];
                                next[idx] = { ...next[idx], uploading: false, success: false, error: 'Failed to upload' };
                                return next;
                            });
                            anyError = true;
                            completed++;
                            if (completed === fileList.length) {
                                // All uploads finished, force all uploading: false
                                setUploadStatuses(prev => prev.map(s => ({ ...s, uploading: false })));
                                if (anyError && callbacks.onError) callbacks.onError();
                                else if (callbacks.onSuccess) callbacks.onSuccess();
                            }
                        },
                    }
                );
            });
        },
    };

    // Handler for file selection (multiple files)
    const handleFilesChange = (selectedFiles: File[]) => {
        // Validate all files
        const invalid = selectedFiles.find(f => {
            const ext = '.' + f.name.split('.').pop()?.toLowerCase();
            return ext !== '.txt' || f.size > 50 * 1024 * 1024;
        });
        if (invalid) {
            setError('All files must be .txt and less than 50MB');
            setFiles([]);
            setUploadStatuses([]);
            return;
        }
        setFiles(selectedFiles);
        setError(null);
        setUploadStatuses(selectedFiles.map(() => ({ uploading: false, success: false, error: null })));
    };

    // Handler for batch submit
    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        if (!files.length) {
            setError('Please select at least one file to upload.');
            return;
        }
        addSourceDocuments.mutate(files, {
            onSuccess: () => {
                setFiles([]);
                setUploadStatuses([]);
                if (onSuccess) onSuccess();
            },
            onError: () => {
                setError('One or more files failed to upload.');
            },
        });
    }, [files, addSourceDocuments, onSuccess]);

    return {
        files,
        setFiles,
        error,
        setError,
        addSourceDocuments,
        handleFilesChange,
        handleSubmit,
        uploadStatuses,
    };
}
