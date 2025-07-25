// Custom React component for uploading source documents

import React from 'react';

import {
    Heading,
    Stack,
    Text,
    Spinner,
    Box,
    Button,
    Input,

} from '@chakra-ui/react'
import { Field } from 'components';
import { FileUploadIcon } from 'icons';

import { useSourceDocUpload } from '../hooks/useSourceDocUpload';
import { AppAlert } from 'components';

/**
 * Props for the SourceDocUploadForm component
 */
export interface SourceDocUploadFormProps {
    /** Callback function called when upload succeeds */
    onSuccess?: () => void;
    /** Optional styling overrides */
    sx?: object;
}

function SourceDocUploadForm({ onSuccess, sx = {} }: SourceDocUploadFormProps): React.ReactElement {

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



    return (
        <Stack bg="secondary" p={4} borderRadius="md" gap={4} >
            <Heading size="xl" >
                Upload Source Document
            </Heading>
            <Heading size="md">
                Upload a text file to create a new source document.
            </Heading>

            {/* Loading Progress */}
            {loading && <Spinner />}

            {/* Success Message */}
            {success && (
                <AppAlert severity="success">
                    {success}
                </AppAlert>
            )}

            {/* Error Message */}
            {error && (
                <AppAlert severity="error">
                    {error}
                </AppAlert>
            )}

            {/* Upload Form */}
            <form onSubmit={handleSubmit} >
                {/* File Upload Section */}
                <Stack>
                    <Heading>
                        Select File *
                    </Heading>
                    <Box
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
                            style={{ display: 'none' }}
                            disabled={loading}
                            data-testid="file-input"
                        />
                        <FileUploadIcon />
                        <Text >
                            {file ? file.name : 'Choose a file'}
                        </Text>
                        <Text>
                            {file
                                ? `Selected: ${(file.size / 1024).toFixed(1)} KB`
                                : 'Drag & drop or click to select a text file'
                            }
                        </Text>
                        <Text>
                            Supported formats: .txt
                        </Text>
                    </Box>
                </Stack>

                {/* Title Input */}
                <Field
                    label="Title"
                    required
                    errorText='Title is required.'
                >
                    <Input onChange={handleTitleChange}
                        required />
                </Field>

                {/* Submit Button */}
                <Button
                    color="primary"
                    variant="ghost"
                    size="xl"
                    disabled={isSubmitDisabled}
                    data-testid="submit-button"
                >
                    {!loading ? <FileUploadIcon /> : undefined}
                    {loading ? 'Uploading...' : 'Upload Document'}
                </Button>
            </form>
        </Stack >
    );
}

export default SourceDocUploadForm;
