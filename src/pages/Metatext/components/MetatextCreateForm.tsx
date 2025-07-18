// Provides a form for creating Metatext documents from source documents.
// The user selects a source document, enters a title, and submits the form.

import React from 'react';
import {
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    useTheme,
    LinearProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from '@mui/material';
import { StarsIcon } from 'icons';

import { useMetatextCreate } from '../hooks/useMetatextCreate';
import { SourceDocumentSummary } from 'types';
import { AppAlert } from 'components';

/**
 * Props for the MetatextCreateForm component
 */
export interface MetatextCreateFormProps {
    /** List of available source documents */
    sourceDocs: SourceDocumentSummary[];
    /** Loading state for source documents */
    sourceDocsLoading: boolean;
    /** Error state for source documents */
    sourceDocsError: string | null;
    /** Callback function called when creation succeeds */
    onSuccess?: () => void;
    /** Optional styling overrides */
    sx?: object;
}

/**
 * MetatextCreateForm Component
 * 
 * A streamlined form component for creating Metatext documents from existing
 * source documents. This component provides a clean, focused interface for
 * Metatext creation without the complexity of mode switching.
 * 
 * Features:
 * - Source document selection dropdown
 * - Title input field
 * - Form validation
 * - Loading states with progress indication
 * - Error handling with user feedback
 * - Success callbacks for integration
 * - Responsive design
 * 
 * @category Components
 * @subcategory Forms
 * @component
 * @example
 * ```tsx
 * <MetatextCreateForm 
 *   sourceDocs={sourceDocs}
 *   sourceDocsLoading={false}
 *   sourceDocsError={null}
 *   onSuccess={() => {
 *     console.log('Metatext created!');
 *     refetchMetatexts();
 *   }}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns {ReactElement} The rendered MetatextCreateForm component
 */
function MetatextCreateForm({
    sourceDocs,
    sourceDocsLoading,
    sourceDocsError,
    onSuccess,
    sx = {}
}: MetatextCreateFormProps): React.ReactElement {
    const theme = useTheme();

    /**
     * Create form state and handlers from custom hook
     */
    const {
        title,
        sourceDocId,
        loading,
        error,
        success,
        isSubmitDisabled,
        handleTitleChange,
        handleSourceDocChange,
        handleSubmit,
        clearMessages
    } = useMetatextCreate({ onSuccess });

    /**
     * Component styles
     */
    const styles = {
        container: {
            p: 3,
            maxWidth: 600,
            margin: '0 auto',
            ...sx
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        },
        selectContainer: {
            minWidth: '100%',
        },
        submitButton: {
            mt: 2,
            py: 1.5,
            fontWeight: 'bold',
            position: 'relative',
        },
        progressContainer: {
            mt: 1,
            mb: 2,
        }
    };

    return (
        <Paper elevation={2} sx={styles.container}>
            {/* Form Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                    Create Metatext
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Select a source document and create a new Metatext.
                </Typography>
            </Box>

            {/* Loading Progress */}
            {loading && (
                <Box sx={styles.progressContainer}>
                    <LinearProgress />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                        Creating Metatext...
                    </Typography>
                </Box>
            )}

            {/* Success Message */}
            {success && (
                <AppAlert severity="success" onClose={clearMessages}>
                    {success}
                </AppAlert>
            )}

            {/* Error Message */}
            {error && (
                <AppAlert severity="error" onClose={clearMessages}>
                    {error}
                </AppAlert>
            )}

            {/* Source Documents Error */}
            {sourceDocsError && (
                <AppAlert severity="warning">
                    {sourceDocsError}
                </AppAlert>
            )}

            {/* Create Form */}
            <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
                {/* Source Document Selection */}
                <FormControl fullWidth required>
                    <InputLabel id="source-doc-select-label">Select Source Document</InputLabel>
                    <Select
                        labelId="source-doc-select-label"
                        id="source-doc-select"
                        value={sourceDocId || ''}
                        label="Select Source Document"
                        onChange={handleSourceDocChange}
                        disabled={loading || sourceDocsLoading}
                        data-testid="source-doc-select"
                    >
                        {sourceDocs.map((doc) => (
                            <MenuItem key={doc.id} value={doc.id}>
                                <Box>
                                    <Typography variant="body1" component="div">
                                        {doc.title}
                                    </Typography>
                                    {doc.author && (
                                        <Typography variant="caption" color="text.secondary">
                                            by {doc.author}
                                        </Typography>
                                    )}
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                        {sourceDocsLoading
                            ? 'Loading source documents...'
                            : 'Choose the source document to create Metatext from'
                        }
                    </FormHelperText>
                </FormControl>

                {/* Title Input */}
                <TextField
                    label="Metatext Title"
                    value={title}
                    onChange={handleTitleChange}
                    fullWidth
                    required
                    disabled={loading}
                    placeholder="Enter a descriptive title for your Metatext"
                    data-testid="title-input"
                    helperText="Choose a clear, descriptive title that will help you identify this Metatext later"
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitDisabled}
                    sx={styles.submitButton}
                    startIcon={!loading ? <StarsIcon /> : undefined}
                    data-testid="submit-button"
                >
                    {loading ? 'Creating...' : 'Create Metatext'}
                </Button>
            </Box>
        </Paper>
    );
}

export default MetatextCreateForm;
