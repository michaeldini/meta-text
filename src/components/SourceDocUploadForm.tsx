// Custom React component for uploading source documents

import React from 'react';
import {
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    useTheme,
    LinearProgress,
    Alert
} from '@mui/material';
import { FileUploadIcon } from './icons';

import { useSourceDocUpload } from '../pages/SourceDocPage/useSourceDocUpload';

/**
 * Props for the SourceDocUploadForm component
 */
export interface SourceDocUploadFormProps {
    /** Callback function called when upload succeeds */
    onSuccess?: () => void;
    /** Optional styling overrides */
    sx?: object;
}

/**
 * SourceDocUploadForm Component
 * 
 * A streamlined form component for uploading source documents. This component
 * provides a clean, focused interface for file uploads without the complexity
 * of mode switching or multiple form types.
 * 
 * Features:
 * - File selection with drag & drop support
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
 * <SourceDocUploadForm 
 *   onSuccess={() => {
 *     console.log('Upload successful!');
 *     refetchDocuments();
 *   }}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns {ReactElement} The rendered SourceDocUploadForm component
 */
function SourceDocUploadForm({ onSuccess, sx = {} }: SourceDocUploadFormProps): React.ReactElement {
    const theme = useTheme();

    /**
     * Upload form state and handlers from custom hook
     */
    const {
        title,
        file,
        loading,
        error,
        success,
        isSubmitDisabled,
        handleTitleChange,
        handleFileChange,
        handleSubmit,
        clearMessages
    } = useSourceDocUpload({ onSuccess });

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
        fileInputContainer: {
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            backgroundColor: theme.palette.background.default,
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
            },
            '&:focus-within': {
                borderColor: theme.palette.primary.main,
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
            }
        },
        fileInput: {
            display: 'none',
        },
        uploadIcon: {
            fontSize: 48,
            color: theme.palette.text.secondary,
            mb: 1,
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
                    Upload Source Document
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Upload a text file to create a new source document.
                </Typography>
            </Box>

            {/* Loading Progress */}
            {loading && (
                <Box sx={styles.progressContainer}>
                    <LinearProgress />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                        Uploading document...
                    </Typography>
                </Box>
            )}

            {/* Success Message */}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessages}>
                    {success}
                </Alert>
            )}

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>
                    {error}
                </Alert>
            )}

            {/* Upload Form */}
            <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
                {/* File Upload Section */}
                <Box>
                    <Typography variant="subtitle1" component="label" htmlFor="file-input" gutterBottom>
                        Select File *
                    </Typography>
                    <Box
                        sx={styles.fileInputContainer}
                        onClick={() => document.getElementById('file-input')?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                document.getElementById('file-input')?.click();
                            }
                        }}
                        aria-label="Click to select file for upload"
                    >
                        <input
                            id="file-input"
                            type="file"
                            accept=".txt,.doc,.docx,.pdf"
                            onChange={handleFileChange}
                            style={styles.fileInput}
                            disabled={loading}
                            data-testid="file-input"
                        />
                        <FileUploadIcon sx={styles.uploadIcon} />
                        <Typography variant="h6" gutterBottom>
                            {file ? file.name : 'Choose a file'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {file
                                ? `Selected: ${(file.size / 1024).toFixed(1)} KB`
                                : 'Drag & drop or click to select a text file'
                            }
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Supported formats: .txt, .doc, .docx, .pdf
                        </Typography>
                    </Box>
                </Box>

                {/* Title Input */}
                <TextField
                    label="Document Title"
                    value={title}
                    onChange={handleTitleChange}
                    fullWidth
                    required
                    disabled={loading}
                    placeholder="Enter a descriptive title for your document"
                    data-testid="title-input"
                    helperText="Choose a clear, descriptive title that will help you identify this document later"
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitDisabled}
                    sx={styles.submitButton}
                    startIcon={!loading ? <FileUploadIcon /> : undefined}
                    data-testid="submit-button"
                >
                    {loading ? 'Uploading...' : 'Upload Document'}
                </Button>
            </Box>
        </Paper>
    );
}

export default SourceDocUploadForm;
