// Component for displaying and editing source document content
// This component is responsible for rendering the text content of a source document
// with appropriate styles and preferences set by the user. It supports both view and edit modes
// for potentially very long documents (book-length content).
import React, { useState, useCallback, useRef } from 'react';

import { Box, Heading, Text, IconButton, Stack, Textarea, Alert, CloseButton } from '@chakra-ui/react';
import { Prose, Tooltip } from 'components';
import { HiPencil, HiCheck } from 'react-icons/hi2';

import type { SourceDocumentDetail } from 'types';
import { useUserConfig } from 'services/userConfigService';
import { updateSourceDocument } from 'services/sourceDocumentService';
import { useUpdateSourceDocument } from 'features';
import { log } from 'utils';


interface SourceDocProps {
    doc: SourceDocumentDetail;
    onDocumentUpdate?: (updatedDoc: SourceDocumentDetail) => void;
}


/**
 * Component for displaying and editing source document content
 * Supports both view and edit modes for potentially very long documents
 */
export default function SourceDoc({ doc, onDocumentUpdate }: SourceDocProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(doc.text || '');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);


    // Use UI preferences from server or defaults
    const { data: userConfig } = useUserConfig();
    const uiPrefs = userConfig?.uiPreferences || {};
    const textSizePx = uiPrefs.textSizePx ?? 28;
    const fontFamily = uiPrefs.fontFamily ?? 'Inter, sans-serif';
    const lineHeight = uiPrefs.lineHeight ?? 1.5;


    const handleEdit = useCallback(() => {
        setIsEditing(true);
        setEditedText(doc.text || '');
        setError(null);
        // Focus the textarea after it renders
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 0);
    }, [doc.text]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setEditedText(doc.text || '');
        setError(null);
    }, [doc.text]);

    const updateSourceDocument = useUpdateSourceDocument(doc.id);
    const handleSave = useCallback(async () => {
        if (isSaving) return;

        setIsSaving(true);
        setError(null);

        try {
            // use the react-query mutation to update the document
            updateSourceDocument.mutate({ text: editedText });

            log.info('Source document text updated successfully', { docId: doc.id });

            setIsEditing(false);
            setShowSuccess(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save document';
            log.error('Failed to save source document text', { docId: doc.id, error: errorMessage });
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    }, [doc.id, editedText, isSaving, onDocumentUpdate]);

    const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedText(event.target.value);
    }, []);

    console.log('Rendering SourceDoc with styles:', lineHeight, textSizePx, fontFamily);

    return (
        <Stack direction="row-reverse" data-testid="source-doc-container">
            {/* Edit Controls */}
            <Stack direction="row" >
                {!isEditing ? (
                    <Tooltip content="Edit document text">
                        <IconButton
                            onClick={handleEdit}
                            variant="ghost"
                            color="primary"
                        >
                            <HiPencil />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <>
                        <Tooltip content="Save changes">
                            <IconButton
                                onClick={handleSave}
                                disabled={isSaving}
                                variant="ghost"
                                color="primary"
                            >
                                <HiCheck />
                            </IconButton>
                        </Tooltip>
                        <Tooltip content="Cancel editing">
                            <IconButton
                                onClick={handleCancel}
                                disabled={isSaving}
                                variant="ghost"
                                color="primary"
                            >
                                <CloseButton />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Stack>

            {/* Content Display/Editor */}
            {isEditing ? (
                <Box >
                    <Textarea
                        size="xl"
                        ref={textareaRef}
                        value={editedText}
                        onChange={handleTextChange}
                        disabled={isSaving}
                        placeholder="Enter document text..."
                        resize="vertical"
                        style={{ minHeight: '80vh', minWidth: '50vw' }}
                    />
                    {isSaving && (
                        <Box>
                            <Text>Saving...</Text>
                        </Box>
                    )}
                </Box>
            ) : (
                <Prose size="lg"
                    aria-label="Document Text"
                    style={{ whiteSpace: 'pre-line', fontSize: `${textSizePx}px`, lineHeight: lineHeight.toString() + 'em', fontFamily: fontFamily }}
                >
                    {doc.text || 'No content available'}
                </Prose>
            )}

            {/* Error Display */}
            {/* {error && (
                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )} */}

            {/* Success Notification */}
            {/* <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}

            >
                <Alert severity="success" onClose={() => setShowSuccess(false)}>
                    Document text updated successfully!
                </Alert> */}
            {/* </Snackbar> */}

        </Stack>
    );
}