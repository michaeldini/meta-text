import { HiArrowDownTray } from 'react-icons/hi2';
// SourceDocUploadForm: main form wrapper orchestrating file picker + submission
import * as React from 'react';
// UI (migrated from Chakra -> Stitches)
import { styled, Heading, Stack, Button, Box } from '@styles';
import { ErrorAlert } from '@components/ErrorAlert';
import SourceDocFilePicker from './SourceDocFilePicker';

// Hook
import { useSourceDocUploadForm } from './useSourceDocUploadForm';

function SourceDocUploadForm(): React.ReactElement {
    const { files, error, addSourceDocuments, handleFilesChange, handleSubmit, uploadStatuses } = useSourceDocUploadForm();
    const isPending = addSourceDocuments.isPending;
    return (
        <Box>
            <Heading>Upload</Heading>
            <ErrorAlert message={"Test error message"} title="Upload failed" data-testid="upload-error" />
            <form onSubmit={handleSubmit} aria-busy={isPending}>
                <Stack>
                    <SourceDocFilePicker
                        files={files}
                        disabled={isPending}
                        onFilesChange={handleFilesChange}
                        uploadStatuses={uploadStatuses}
                    />
                    <Button
                        type="submit"
                        tone={isPending || !files.length ? 'disabled' : 'primary'}

                        data-testid="submit-button"
                    >
                        {!isPending && <HiArrowDownTray />}
                        {isPending ? 'Uploading...' : 'Upload Documents'}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}

export default SourceDocUploadForm;
