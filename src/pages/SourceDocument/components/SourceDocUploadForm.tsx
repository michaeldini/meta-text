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

import { useState, useCallback } from 'react';
import { useAddSourceDocument } from 'features';

/**
 * Props for the SourceDocUploadForm component
 */
export interface SourceDocUploadFormProps {
    /** Callback function called when upload succeeds */
    onSuccess: () => void;
}
/**
 * SourceDocUploadForm component for uploading source documents
 * - Uses custom hook for managing upload state
 * - Displays form with title and file input
 * - Handles file selection and submission
 */
function SourceDocUploadForm({ onSuccess }: SourceDocUploadFormProps): React.ReactElement {
    // Local state for form fields
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    // React Query mutation for upload
    const addSourceDocument = useAddSourceDocument();

    // Handlers
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        if (error) setError(null);
    };

    // Inline handler for file change
    const handleFileChange = (file: File | null) => {
        if (file) {
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            if (fileExtension !== '.txt') {
                setError('Only .txt files are allowed');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }
        }
        setFile(file);
        if (error) setError(null);
    };

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        if (!title.trim()) {
            setError('Title is required.');
            return;
        }
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        addSourceDocument.mutate(
            { title: title.trim(), file },
            {
                onSuccess: () => {
                    setTitle('');
                    setFile(null);
                    if (onSuccess) onSuccess();
                },
                onError: () => {
                    setError('Failed to upload document.');
                },
            }
        );
    }, [title, file, addSourceDocument, onSuccess]);

    // UI
    const UploadHeading = (
        <Heading size="4xl">Upload</Heading>
    );
    const SubHeading = (
        <Heading size="sm">
            Upload a text file to create a new source document.
        </Heading>
    );
    const LoadingSpinner = addSourceDocument.isPending ? <Spinner /> : null;
    const SubmitButton = (
        <Button
            type="submit"
            color="primary"
            variant="ghost"
            size="xl"
            disabled={addSourceDocument.isPending || !title.trim() || !file}
            data-testid="submit-button"
        >
            {!addSourceDocument.isPending ? <FileUploadIcon /> : undefined}
            {addSourceDocument.isPending ? 'Uploading...' : 'Upload Document'}
        </Button>
    );
    const FileUploadSection = (
        <Stack p={4}>
            <Field
                label="Title"
                required
                errorText="Title is required."
            >
                <Input onChange={handleTitleChange} value={title} required />
            </Field>
            <FileUpload.Root
                accept={[".txt"]}
                maxFiles={1}
                maxFileSize={10 * 1024 * 1024}
                onFileChange={({ acceptedFiles }) => handleFileChange(acceptedFiles[0])}
                disabled={addSourceDocument.isPending}
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
    );

    return (
        <Stack borderRadius="md">
            {UploadHeading}
            {SubHeading}
            {LoadingSpinner}
            {error && (
                <Box my={2}>
                    <Box bg="red.100" color="red.800" p={2} borderRadius="md">
                        {error}
                    </Box>
                </Box>
            )}
            <form onSubmit={handleSubmit}>
                {SubmitButton}
                {FileUploadSection}
            </form>
        </Stack>
    );
}

export default SourceDocUploadForm;
