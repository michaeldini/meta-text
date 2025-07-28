// Hook for managing source document editing state and logic
// Encapsulates all state, handlers, and UI preferences for editing a source document
import { useState, useCallback, useRef } from 'react';
import type { SourceDocumentDetail } from 'types';
import { useUserConfig } from 'services/userConfigService';
import { useUpdateSourceDocument } from 'features';
import { log } from 'utils';

export function useSourceDocEditor(
    doc: SourceDocumentDetail | null,
    onDocumentUpdate?: (updatedDoc: SourceDocumentDetail) => void
) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedText, setEditedText] = useState<string>(doc?.text || '');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // UI preferences
    const { data: userConfig } = useUserConfig();
    const uiPrefs = userConfig?.uiPreferences || {};
    const textSizePx = uiPrefs.textSizePx ?? 28;
    const fontFamily = uiPrefs.fontFamily ?? 'Inter, sans-serif';
    const lineHeight = uiPrefs.lineHeight ?? 1.5;

    // Document update mutation
    const updateSourceDocument = useUpdateSourceDocument(doc?.id ?? 0);

    const handleEdit = useCallback(() => {
        setIsEditing(true);
        setEditedText(doc?.text || '');
        setError(null);
    }, [doc?.text]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setEditedText(doc?.text || '');
        setError(null);
    }, [doc?.text]);

    const handleSave = useCallback(async () => {
        if (isSaving) return;
        setIsSaving(true);
        setError(null);
        try {
            updateSourceDocument.mutate({ text: editedText });
            log.info('Source document text updated successfully', { docId: doc?.id });
            setIsEditing(false);
            setShowSuccess(true);
            // Only call onDocumentUpdate if doc and doc.id are defined
            if (onDocumentUpdate && doc && typeof doc.id === 'number') {
                onDocumentUpdate({ ...doc, text: editedText });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save document';
            log.error('Failed to save source document text', { docId: doc?.id, error: errorMessage });
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    }, [doc?.id, editedText, isSaving, onDocumentUpdate]);

    const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedText(event.target.value);
    }, []);

    return {
        isEditing,
        setIsEditing,
        editedText,
        setEditedText,
        isSaving,
        showSuccess,
        error,
        textSizePx,
        fontFamily,
        lineHeight,
        handleEdit,
        handleCancel,
        handleSave,
        handleTextChange,
    };
}
