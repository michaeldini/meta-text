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
    FileUpload,
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
        <Stack borderRadius="md" >
            <Heading size="4xl" >
                Upload
            </Heading>
            <Heading size="sm">
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
                {/* Submit Button */}
                <Button
                    type="submit"
                    color="primary"
                    variant="ghost"
                    size="xl"
                    disabled={isSubmitDisabled}
                    data-testid="submit-button"
                >
                    {!loading ? <FileUploadIcon /> : undefined}
                    {loading ? 'Uploading...' : 'Upload Document'}
                </Button>
                {/* File Upload Section */}
                <Stack p={4}>
                    {/* Title Input */}
                    <Field
                        label="Title"
                        required
                        errorText='Title is required.'
                    >
                        <Input onChange={handleTitleChange}
                            required />
                    </Field>
                    <FileUpload.Root
                        accept={[".txt"]}
                        maxFiles={1}
                        maxFileSize={10 * 1024 * 1024} // 10 MB
                        onFileChange={({ acceptedFiles }) => handleFileChange(acceptedFiles[0])}
                        disabled={loading}
                        required
                    >
                        <FileUpload.HiddenInput data-testid="file-input" />
                        <FileUpload.Label>
                            <Text>Choose a file</Text>
                        </FileUpload.Label>
                        <FileUpload.Dropzone>
                            <FileUpload.DropzoneContent>
                                <FileUploadIcon />
                                <Text>
                                    {file ? file.name : 'Drag & drop or click to select a text file'}
                                </Text>
                                <Text fontSize="sm" color="fg.muted">
                                    {file ? `Selected: ${(file.size / 1024).toFixed(1)} KB` : 'Only .txt files are allowed'}
                                </Text>
                            </FileUpload.DropzoneContent>
                        </FileUpload.Dropzone>
                    </FileUpload.Root>
                </Stack>




            </form >
        </Stack >
    );
}

export default SourceDocUploadForm;
