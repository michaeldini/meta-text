// Component for displaying and editing source document content
// This component is responsible for rendering the text content of a source document
// with appropriate styles and preferences set by the user. It supports both view and edit modes
// for potentially very long documents (book-length content).
import React, { useState, useCallback, useRef } from 'react';
import { Box, Typography, useTheme, IconButton, Tooltip, Alert, Snackbar } from '@mui/material';
import { PencilIcon, CheckIcon, ClearIcon } from 'icons';

import type { SourceDocumentDetail } from 'types';
import { useUIPreferences } from 'store/uiPreferences';
import { updateSourceDocument } from 'services/sourceDocumentService';
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
    const theme = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(doc.text || '');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Use UI preferences from server or defaults
    const { textSizePx, fontFamily, lineHeight } = useUIPreferences();

    // Memoized styles to prevent recreation on each render
    const styles = React.useMemo(() => ({
        container: {
            width: '100%',
            paddingX: theme.spacing(2),
            position: 'relative' as const
        },
        controlsContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: theme.spacing(1),
            gap: theme.spacing(1)
        },
        editButton: {
            color: theme.palette.secondary.main
        },
        saveButton: {
            color: theme.palette.success.main
        },
        cancelButton: {
            color: theme.palette.error.main
        },
        textareaContainer: {
            width: '100%',
            position: 'relative' as const
        },
        textarea: {
            width: '100%',
            minHeight: '60vh',
            padding: theme.spacing(2),
            fontSize: textSizePx,
            fontFamily: fontFamily,
            lineHeight: lineHeight,
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: theme.shape.borderRadius,
            outline: 'none',
            resize: 'vertical' as const,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            whiteSpace: 'pre-wrap' as const,
            wordWrap: 'break-word' as const
        },
        loadingOverlay: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.shape.borderRadius
        },
        loadingText: {
            color: theme.palette.primary.main
        },
        documentText: {
            fontSize: textSizePx,
            fontFamily,
            lineHeight,
            whiteSpace: 'pre-wrap' as const,
            overflowWrap: 'break-word' as const
        },
        errorAlert: {
            marginTop: theme.spacing(2)
        },
        snackbarAnchor: {
            vertical: 'bottom' as const,
            horizontal: 'center' as const
        }
    }), [theme, textSizePx, fontFamily, lineHeight]);

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

    const handleSave = useCallback(async () => {
        if (isSaving) return;

        setIsSaving(true);
        setError(null);

        try {
            log.info('Saving source document text update', { docId: doc.id, textLength: editedText.length });

            const updatedDoc = await updateSourceDocument(doc.id, { text: editedText });

            log.info('Source document text updated successfully', { docId: doc.id });

            // Call the callback to update parent component
            onDocumentUpdate?.(updatedDoc);

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
        <Box sx={styles.container} data-testid="source-doc-container">
            {/* Edit Controls */}
            <Box sx={styles.controlsContainer}>
                {!isEditing ? (
                    <Tooltip title="Edit document text">
                        <IconButton
                            onClick={handleEdit}
                            size="small"
                            sx={styles.editButton}
                        >
                            <PencilIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <>
                        <Tooltip title="Save changes">
                            <IconButton
                                onClick={handleSave}
                                disabled={isSaving}
                                size="small"
                                sx={styles.saveButton}
                            >
                                <CheckIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel editing">
                            <IconButton
                                onClick={handleCancel}
                                disabled={isSaving}
                                size="small"
                                sx={styles.cancelButton}
                            >
                                <ClearIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>

            {/* Content Display/Editor */}
            {isEditing ? (
                <Box sx={styles.textareaContainer}>
                    <textarea
                        ref={textareaRef}
                        value={editedText}
                        onChange={handleTextChange}
                        disabled={isSaving}
                        style={styles.textarea}
                        placeholder="Enter document text..."
                    />
                    {isSaving && (
                        <Box sx={styles.loadingOverlay}>
                            <Typography variant="body2" sx={styles.loadingText}>
                                Saving...
                            </Typography>
                        </Box>
                    )}
                </Box>
            ) : (
                <Typography
                    aria-label="Document Text"
                    sx={styles.documentText}
                >
                    {doc.text || 'No content available'}
                </Typography>
            )}

            {/* Error Display */}
            {error && (
                <Alert
                    severity="error"
                    sx={styles.errorAlert}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            {/* Success Notification */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={styles.snackbarAnchor}
            >
                <Alert severity="success" onClose={() => setShowSuccess(false)}>
                    Document text updated successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}