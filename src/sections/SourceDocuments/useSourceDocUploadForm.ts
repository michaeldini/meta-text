// Hook relocated from pages/SourceDocument/hooks/useSourceDocUploadForm
import { useState, useCallback } from 'react';
import { useAddSourceDocument } from '@features/documents/useDocumentsData';

export function useSourceDocUploadForm() {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [uploadStatuses, setUploadStatuses] = useState<{ uploading: boolean; success: boolean; error: string | null; }[]>([]);
    const addSourceDocument = useAddSourceDocument();
    const addSourceDocuments = {
        isPending: uploadStatuses.length > 0 && uploadStatuses.some(s => s.uploading),
        mutate: async (fileList: File[], callbacks: { onSuccess?: () => void; onError?: () => void }) => {
            if (!fileList.length) return;
            setUploadStatuses(fileList.map(() => ({ uploading: true, success: false, error: null })));
            let anyError = false;
            for (let idx = 0; idx < fileList.length; idx++) {
                const file = fileList[idx];
                try {
                    await addSourceDocument.mutateAsync({ title: file.name.replace(/\.[^.]+$/, ''), file });
                    setUploadStatuses(prev => { const next = [...prev]; if (next[idx]) next[idx] = { uploading: false, success: true, error: null }; return next; });
                } catch {
                    anyError = true;
                    setUploadStatuses(prev => { const next = [...prev]; if (next[idx]) next[idx] = { uploading: false, success: false, error: 'Failed to upload' }; return next; });
                }
            }
            setUploadStatuses(prev => prev.map(s => ({ ...s, uploading: false })));
            anyError ? callbacks.onError?.() : callbacks.onSuccess?.();
        },
    };
    const handleFilesChange = (selected: File[]) => {
        const invalid = selected.find(f => '.' + f.name.split('.').pop()?.toLowerCase() !== '.txt' || f.size > 50 * 1024 * 1024);
        if (invalid) { setError('All files must be .txt and less than 50MB'); setFiles([]); setUploadStatuses([]); return; }
        setFiles(selected); setError(null); setUploadStatuses(selected.map(() => ({ uploading: false, success: false, error: null })));
    };
    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); setError(null); if (!files.length) { setError('Please select at least one file to upload.'); return; }
        addSourceDocuments.mutate(files, { onSuccess: () => { setFiles([]); setUploadStatuses([]); }, onError: () => { setError('One or more files failed to upload.'); } });
    }, [files, addSourceDocuments]);
    return { files, setFiles, error, setError, addSourceDocuments, handleFilesChange, handleSubmit, uploadStatuses };
}
