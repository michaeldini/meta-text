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
        mutate: (fileList: File[], callbacks: { onSuccess?: () => void; onError?: () => void }) => {
            setUploadStatuses(fileList.map(() => ({ uploading: true, success: false, error: null })));
            let completed = 0; let anyError = false;
            fileList.forEach((file, idx) => {
                addSourceDocument.mutate({ title: file.name.replace(/\.[^.]+$/, ''), file }, {
                    onSuccess: () => { setUploadStatuses(prev => { const next = [...prev]; next[idx] = { ...next[idx], uploading: false, success: true, error: null }; return next; }); if (++completed === fileList.length) finalize(); },
                    onError: () => { setUploadStatuses(prev => { const next = [...prev]; next[idx] = { ...next[idx], uploading: false, success: false, error: 'Failed to upload' }; return next; }); anyError = true; if (++completed === fileList.length) finalize(); }
                });
            });
            function finalize() { setUploadStatuses(prev => prev.map(s => ({ ...s, uploading: false }))); anyError ? callbacks.onError?.() : callbacks.onSuccess?.(); }
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
