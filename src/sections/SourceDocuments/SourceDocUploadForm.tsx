// SourceDocUploadForm: main form wrapper orchestrating file picker + submission
import React from 'react';

// UI
import { Heading } from '@chakra-ui/react/heading';
import { Button, } from '@chakra-ui/react/button';
import { Stack, } from '@chakra-ui/react/stack';
import { ErrorAlert } from '@components/ErrorAlert';
import { Icon } from '@components/icons/Icon';
import SourceDocFilePicker from './SourceDocFilePicker';

// Hook
import { useSourceDocUploadForm } from './useSourceDocUploadForm';

function SourceDocUploadForm(): React.ReactElement {
    const { files, error, addSourceDocuments, handleFilesChange, handleSubmit, uploadStatuses } = useSourceDocUploadForm();
    const isPending = addSourceDocuments.isPending;

    return (
        <Stack p="2" borderWidth="4px" borderColor="border.muted" borderRadius="lg" dropShadow="md">
            <Heading size="sub">Upload</Heading>
            <ErrorAlert message={error} title="Upload failed" data-testid="upload-error" />
            <form onSubmit={handleSubmit} aria-busy={isPending}>
                <Stack direction="column">
                    <SourceDocFilePicker
                        files={files}
                        disabled={isPending}
                        onFilesChange={handleFilesChange}
                        uploadStatuses={uploadStatuses}
                    />
                    <Button
                        type="submit"
                        color="primary"
                        variant="ghost"
                        loading={isPending}
                        size="xl"
                        disabled={isPending || !files.length}
                        data-testid="submit-button"
                    >
                        {!isPending && <Icon name='Download' />}
                        {isPending ? 'Uploading...' : 'Upload Documents'}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}

export default SourceDocUploadForm;
