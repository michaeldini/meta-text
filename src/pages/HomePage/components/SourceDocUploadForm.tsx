import { HiArrowDownTray } from 'react-icons/hi2';
// SourceDocUploadForm: main form wrapper orchestrating file picker + submission
import * as React from 'react';
// UI (migrated from Chakra -> Stitches)
import { Heading, Column, Box } from '@styles';
import { ErrorAlert } from '@components/ErrorAlert';
import SourceDocFilePicker from './SourceDocFilePicker';

// Hook
import { useSourceDocUploadForm } from '../hooks/useSourceDocUploadForm';
import { TooltipButton } from '@components/ui';

function SourceDocUploadForm(): React.ReactElement {
    const { files, error, addSourceDocuments, handleFilesChange, handleSubmit, uploadStatuses } = useSourceDocUploadForm();
    const isPending = addSourceDocuments.isPending;
    return (
        <Box variant="homepageSection">
            <Heading>Upload</Heading>
            <ErrorAlert message={error} title="Upload failed" data-testid="upload-error" />
            <form onSubmit={handleSubmit} aria-busy={isPending}>
                <Column>
                    <SourceDocFilePicker
                        files={files}
                        disabled={isPending}
                        onFilesChange={handleFilesChange}
                        uploadStatuses={uploadStatuses}
                    />
                    <TooltipButton
                        label="Upload Documents"
                        tooltip={files.length === 0 ? 'Please select files to upload' : 'Submit to upload documents'}
                        disabled={files.length === 0 || isPending}
                        loading={isPending}
                        icon={<HiArrowDownTray style={{ marginRight: 8 }} />}
                        type="submit"
                        data-testid="submit-button"
                    >
                        {!isPending && <HiArrowDownTray />}
                        {isPending ? 'Uploading...' : 'Upload Documents'}
                    </TooltipButton>
                </Column>
            </form>
        </Box>
    );
}

export default SourceDocUploadForm;
