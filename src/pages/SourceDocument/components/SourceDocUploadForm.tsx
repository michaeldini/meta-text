// Custom React component for uploading source documents

import React from 'react';


import { Heading, Text } from '@chakra-ui/react';
import { Stack } from '@chakra-ui/react/stack'
import { Box } from '@chakra-ui/react/box'
import { Button } from '@chakra-ui/react/button';
// import { Input } from '@chakra-ui/react/input'
import { FileUpload } from '@chakra-ui/react/file-upload';

import { Field } from 'components';
import { HiArrowDownTray } from 'react-icons/hi2';

import { useSourceDocUploadForm } from '../hooks/useSourceDocUploadForm';
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
    // Use custom hook for all form logic
    const {
        files,
        error,
        addSourceDocuments,
        handleFilesChange,
        handleSubmit,
        uploadStatuses,
    } = useSourceDocUploadForm(onSuccess);

    // UI

    const UploadHeading = (
        <Heading size="4xl">Batch Upload</Heading>
    );
    const SubHeading = (
        <Heading size="sm">
            Upload one or more .txt files. Each file will be uploaded as a separate document using its filename as the title.
        </Heading>
    );

    const SubmitButton = (
        <Button
            type="submit"
            color="primary"
            variant="ghost"
            loading={addSourceDocuments.isPending}
            size="xl"
            disabled={addSourceDocuments.isPending || !files.length}
            data-testid="submit-button"
        >
            {!addSourceDocuments.isPending ? <HiArrowDownTray /> : undefined}
            {addSourceDocuments.isPending ? 'Uploading...' : 'Upload Documents'}
        </Button>
    );
    const FileUploadSection = (
        <Stack p={4}>
            <FileUpload.Root
                accept={[".txt"]}
                maxFiles={100}
                maxFileSize={50 * 1024 * 1024}
                onFileChange={({ acceptedFiles }) => handleFilesChange(acceptedFiles)}
                disabled={addSourceDocuments.isPending}
                required
            >
                <FileUpload.HiddenInput data-testid="file-input" />
                <FileUpload.Label>
                    <Text>Choose files</Text>
                </FileUpload.Label>
                <FileUpload.Dropzone>
                    <FileUpload.DropzoneContent>
                        <HiArrowDownTray />
                        <Text>
                            {files.length
                                ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
                                : 'Drag & drop or click to select .txt files'}
                        </Text>
                        <Text fontSize="sm" color="fg.muted">
                            {files.length
                                ? files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join(', ')
                                : 'Only .txt files are allowed'}
                        </Text>
                    </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
            </FileUpload.Root>
            {files.length > 0 && (
                <Box mt={2}>
                    <Text fontWeight="bold">Files to upload:</Text>
                    <Stack gap={1}>
                        {files.map((f, idx) => (
                            <Box key={f.name + f.size} p={2} borderWidth={1} borderRadius="md" bg="gray.50">
                                <Text>{f.name}</Text>
                                <Text fontSize="sm" color="fg.muted">{(f.size / 1024).toFixed(1)} KB</Text>
                                {uploadStatuses && uploadStatuses[idx] && (
                                    <Text fontSize="sm" color={uploadStatuses[idx].error ? 'red.500' : 'green.600'}>
                                        {uploadStatuses[idx].error
                                            ? `Error: ${uploadStatuses[idx].error}`
                                            : uploadStatuses[idx].success
                                                ? 'Uploaded'
                                                : uploadStatuses[idx].uploading
                                                    ? 'Uploading...'
                                                    : ''}
                                    </Text>
                                )}
                            </Box>
                        ))}
                    </Stack>
                </Box>
            )}
        </Stack>
    );

    return (
        <Stack borderRadius="md">
            {UploadHeading}
            {SubHeading}
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
