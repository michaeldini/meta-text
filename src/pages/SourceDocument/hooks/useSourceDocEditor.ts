// Hook for managing source document editing state and logic
// Encapsulates all state, handlers, and UI preferences for editing a source document
import { useState, useCallback, useRef } from 'react';
import type { SourceDocumentDetail } from '@mtypes/documents';
import { useUpdateSourceDocument } from '@features/documents/useDocumentsData';
import log from '@utils/logger';


// Refactored hook for Chakra UI Editable integration
export function useSourceDocEditor(
    doc: SourceDocumentDetail | null,
    onDocumentUpdate?: (updatedDoc: SourceDocumentDetail) => void
) {
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    // Document update mutation
    const updateSourceDocument = useUpdateSourceDocument(doc?.id ?? 0);

    // Save handler for Editable
    const handleSave = useCallback(() => {
        if (!doc) return;
        setIsSaving(true);
        setError(null);
        try {
            updateSourceDocument.mutate({ text: doc.text });
            log.info('Source document text updated successfully', { docId: doc.id });
            if (onDocumentUpdate) {
                onDocumentUpdate({ ...doc });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save document';
            log.error('Failed to save source document text', { docId: doc.id, error: errorMessage });
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    }, [doc, updateSourceDocument, onDocumentUpdate]);

    // Value change handler for Editable
    const handleTextChange = useCallback((value: string) => {
        if (doc) {
            doc.text = value;
        }
    }, [doc]);

    return {
        isSaving,
        error,
        handleSave,
        handleTextChange,
    };
}
