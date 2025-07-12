import React, { useState, useCallback, useMemo } from 'react';
import { Box, useTheme, Accordion, AccordionSummary, AccordionDetails, Typography, Alert, TextField, IconButton, Tooltip, Snackbar } from '@mui/material';
import { ExpandMoreIcon, PencilIcon, CheckIcon, ClearIcon } from 'icons';

import { splitToArray } from 'utils';
import { SourceDocumentDetail, SourceDocumentUpdate } from 'types';
import { updateSourceDocument } from 'services/sourceDocumentService';
import { log } from 'utils';

interface SourceDocInfoProps {
    doc: SourceDocumentDetail;
    onDocumentUpdate?: (updatedDoc: SourceDocumentDetail) => void;
}

// Configuration for rendering fields in the document info
interface FieldConfig {
    key: keyof import('types').SourceDocumentSummary;
    label: string;
    isListField?: boolean;
}
const FIELD_CONFIG: FieldConfig[] = [
    { key: 'author', label: 'Author' },
    { key: 'summary', label: 'Summary' },
    { key: 'characters', label: 'Characters', isListField: true },
    { key: 'locations', label: 'Locations', isListField: true },
    { key: 'themes', label: 'Themes', isListField: true },
    { key: 'symbols', label: 'Symbols', isListField: true },
];

const SourceDocInfo: React.FC<SourceDocInfoProps> = ({ doc, onDocumentUpdate }) => {
    const theme = useTheme();
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Memoized styles
    const styles = useMemo(() => ({
        container: {
            width: '100%',
            paddingX: theme.spacing(2),
        },
        fieldHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        },
        editButton: {
            color: theme.palette.secondary.main,
            padding: theme.spacing(0.5)
        },
        saveButton: {
            color: theme.palette.success.main,
            padding: theme.spacing(0.5)
        },
        cancelButton: {
            color: theme.palette.error.main,
            padding: theme.spacing(0.5)
        },
        textField: {
            width: '100%',
            marginBottom: theme.spacing(1)
        },
        errorAlert: {
            marginTop: theme.spacing(2)
        },
        snackbarAnchor: {
            vertical: 'bottom' as const,
            horizontal: 'center' as const
        }
    }), [theme]);

    // Helper functions for list fields
    const arrayToText = useCallback((value: string): string => {
        if (!value) return '';
        const arr = splitToArray(value);
        return arr.join(', ');
    }, []);

    const textToArray = useCallback((text: string): string => {
        if (!text.trim()) return '';
        return text.split(',').map(item => item.trim()).filter(item => item).join(', ');
    }, []);

    // Edit handlers
    const handleEdit = useCallback((fieldKey: string, currentValue: string | null, isListField: boolean) => {
        setEditingField(fieldKey);
        const displayValue = isListField && currentValue
            ? arrayToText(currentValue)
            : currentValue || '';
        setEditValues({ [fieldKey]: displayValue });
        setError(null);
    }, [arrayToText]);

    const handleCancel = useCallback(() => {
        setEditingField(null);
        setEditValues({});
        setError(null);
    }, []);

    const handleSave = useCallback(async (fieldKey: string, isListField: boolean) => {
        if (isSaving) return;

        setIsSaving(true);
        setError(null);

        try {
            const rawValue = editValues[fieldKey] || '';
            const processedValue = isListField ? textToArray(rawValue) : rawValue.trim();

            log.info('Saving source document field update', {
                docId: doc.id,
                field: fieldKey,
                isListField,
                value: processedValue
            });

            const updateData: SourceDocumentUpdate = {
                [fieldKey]: processedValue || null
            };

            const updatedDoc = await updateSourceDocument(doc.id, updateData);

            log.info('Source document field updated successfully', { docId: doc.id, field: fieldKey });

            // Call the callback to update parent component
            onDocumentUpdate?.(updatedDoc);

            setEditingField(null);
            setEditValues({});
            setShowSuccess(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save field';
            log.error('Failed to save source document field', {
                docId: doc.id,
                field: fieldKey,
                error: errorMessage
            });
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    }, [doc.id, editValues, isSaving, onDocumentUpdate, textToArray]);

    const handleInputChange = useCallback((fieldKey: string, value: string) => {
        setEditValues(prev => ({ ...prev, [fieldKey]: value }));
    }, []);


    // Render each field in the document info with edit capability
    const renderField = (config: FieldConfig) => {
        if (!doc) return null;
        const value = doc[config.key];
        const fieldKey = config.key as string;
        const isEditing = editingField === fieldKey;

        // Show empty fields as editable when not editing
        const hasValue = value !== null && value !== undefined && value !== '';

        if (!hasValue && !isEditing) {
            return (
                <Accordion
                    key={config.key}
                    slotProps={{ transition: { unmountOnExit: true } }}
                    disableGutters={true}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" color="text.secondary">
                            {config.label} (Empty)
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={styles.fieldHeader}>
                            <Typography color="text.secondary">
                                No {config.label.toLowerCase()} added yet
                            </Typography>
                            <Tooltip title={`Add ${config.label.toLowerCase()}`}>
                                <IconButton
                                    onClick={() => handleEdit(fieldKey, value as string, config.isListField || false)}
                                    disabled={isSaving}
                                    size="small"
                                    sx={styles.editButton}
                                >
                                    <PencilIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            );
        }

        if (!hasValue && !isEditing) return null;

        if (config.isListField) {
            const arr = value ? splitToArray(value as string) : [];
            return (
                <Accordion
                    key={config.key}
                    slotProps={{ transition: { unmountOnExit: true } }}
                    disableGutters={true}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">{config.label}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {isEditing ? (
                            <Box>
                                <TextField
                                    multiline
                                    rows={3}
                                    value={editValues[fieldKey] || ''}
                                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                                    placeholder={`Enter ${config.label.toLowerCase()} separated by commas`}
                                    disabled={isSaving}
                                    sx={styles.textField}
                                    helperText="Separate multiple items with commas"
                                />
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <Tooltip title="Save changes">
                                        <IconButton
                                            onClick={() => handleSave(fieldKey, true)}
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
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={styles.fieldHeader}>
                                <Typography>
                                    {arr.length > 0 ? arr.join(', ') : 'No items'}
                                </Typography>
                                <Tooltip title={`Edit ${config.label.toLowerCase()}`}>
                                    <IconButton
                                        onClick={() => handleEdit(fieldKey, value as string, true)}
                                        disabled={isSaving}
                                        size="small"
                                        sx={styles.editButton}
                                    >
                                        <PencilIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </AccordionDetails>
                </Accordion>
            );
        }

        return (
            <Accordion
                key={config.key}
                slotProps={{ transition: { unmountOnExit: true } }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{config.label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {isEditing ? (
                        <Box>
                            <TextField
                                multiline
                                rows={config.key === 'summary' ? 4 : 2}
                                value={editValues[fieldKey] || ''}
                                onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                                placeholder={`Enter ${config.label.toLowerCase()}`}
                                disabled={isSaving}
                                sx={styles.textField}
                            />
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Tooltip title="Save changes">
                                    <IconButton
                                        onClick={() => handleSave(fieldKey, false)}
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
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={styles.fieldHeader}>
                            <Typography>
                                {value as string}
                            </Typography>
                            <Tooltip title={`Edit ${config.label.toLowerCase()}`}>
                                <IconButton
                                    onClick={() => handleEdit(fieldKey, value as string, false)}
                                    disabled={isSaving}
                                    size="small"
                                    sx={styles.editButton}
                                >
                                    <PencilIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>
        );
    };


    return (
        <Box sx={styles.container} data-testid="source-doc-info">
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Document: {doc.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {FIELD_CONFIG.map(config => renderField(config))}
                </AccordionDetails>
            </Accordion>

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
                    Field updated successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SourceDocInfo;
