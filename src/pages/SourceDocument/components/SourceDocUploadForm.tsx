// Custom React component for uploading source documents

import React from 'react';


import { Heading, Text, Wrap, WrapItem, Tag, Center } from '@chakra-ui/react';
import { Stack } from '@chakra-ui/react/stack'
import { Box } from '@chakra-ui/react/box'
import { Button } from '@chakra-ui/react/button';
import { FileUpload } from '@chakra-ui/react/file-upload';

import { Field, Prose } from '@components/ui';
import { HiArrowDownTray } from 'react-icons/hi2';

import { useSourceDocUploadForm } from '../hooks/useSourceDocUploadForm';

/**
 * SourceDocUploadForm component for uploading source documents
 * - Uses custom hook for managing upload state
 * - Displays form with title and file input
 * - Handles file selection and submission
 */
function SourceDocUploadForm(): React.ReactElement {
    // Use custom hook for all form logic
    const {
        files,
        error,
        addSourceDocuments,
        handleFilesChange,
        handleSubmit,
        uploadStatuses,
    } = useSourceDocUploadForm();

    // UI

    const UploadHeading = (
        <Heading variant="subHeading">Upload</Heading>
    );
    const SubHeading = (
        <Prose>
            Upload one or more .txt files. Each file will be uploaded as a separate document using its filename as the title.
        </Prose>
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
        <Stack >
            <FileUpload.Root
                accept={[".txt"]}
                maxFiles={100}
                maxFileSize={50 * 1024 * 1024}
                onFileChange={({ acceptedFiles }) => handleFilesChange(acceptedFiles)}
                disabled={addSourceDocuments.isPending}
                required
                alignItems="center"
            >
                <FileUpload.HiddenInput data-testid="file-input" />
                <FileUpload.Dropzone bg="none">
                    <FileUpload.DropzoneContent >
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
                    <Text fontWeight="bold" mb={2}>Files to upload:</Text>
                    <Wrap>
                        {files.map((f, idx) => {
                            const status = uploadStatuses && uploadStatuses[idx];
                            let colorPalette: string = 'gray';
                            let label = f.name;
                            let icon = null;
                            if (status) {
                                if (status.uploading) {
                                    colorPalette = 'yellow';
                                    label = `${f.name} (Uploading...)`;
                                } else if (status.success) {
                                    colorPalette = 'green';
                                    label = `${f.name} (Uploaded)`;
                                } else if (status.error) {
                                    colorPalette = 'red';
                                    label = `${f.name} (Error)`;
                                }
                            }
                            return (
                                <WrapItem key={f.name + f.size}>
                                    <Tag.Root colorPalette={colorPalette} variant="solid" size="md" maxW="250px">
                                        <Tag.Label truncate>{label}</Tag.Label>
                                    </Tag.Root>
                                </WrapItem>
                            );
                        })}
                    </Wrap>
                </Box>
            )}
        </Stack>
    );

    return (
        <Stack width="400px">
            {UploadHeading}
            {/* {SubHeading} */}
            {error && (
                <Box my={2}>
                    <Box bg="red.100" color="red.800" p={2} borderRadius="md">
                        {error}
                    </Box>
                </Box>
            )}
            <form onSubmit={handleSubmit}>
                <Stack direction="column" >
                    {FileUploadSection}
                    {SubmitButton}
                </Stack>
            </form>
        </Stack>
    );
}

export default SourceDocUploadForm;
