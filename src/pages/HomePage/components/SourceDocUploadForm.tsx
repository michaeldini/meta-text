import { HiArrowDownTray } from 'react-icons/hi2';
// SourceDocUploadForm: main form wrapper orchestrating file picker + submission
import * as React from 'react';
// UI (migrated from Chakra -> Stitches)
import { Heading, Column, Box } from '@styles';
import { Alert } from '@components/Alert';
import SourceDocFilePicker from './SourceDocFilePicker';

// Hook
import { useSourceDocUploadForm } from '../hooks/useSourceDocUploadForm';
import { Button, Tooltip } from '@components';

export function SourceDocUploadForm(): React.ReactElement {
    const { files, error, addSourceDocuments, handleFilesChange, handleSubmit, uploadStatuses } = useSourceDocUploadForm();
    const isPending = addSourceDocuments.isPending;
    return (
        <Box variant="homepageSection">
            <Heading>Upload</Heading>
            <Alert message={error} title="Upload failed" data-testid="upload-error" />
            <form onSubmit={handleSubmit} aria-busy={isPending}>
                <Column>
                    <SourceDocFilePicker
                        files={files}
                        disabled={isPending}
                        onFilesChange={handleFilesChange}
                        uploadStatuses={uploadStatuses}
                    />
                    <Tooltip
                        content={files.length === 0 ? 'Please select files to upload' : 'Submit to upload documents'}
                    >
                        <Button
                            type="submit"
                            icon={<HiArrowDownTray style={{ marginRight: 8 }} />}
                            disabled={files.length === 0 || isPending}
                            data-testid="submit-button"
                        >
                            {isPending ? 'Uploading...' : 'Upload Documents'}
                        </Button>
                    </Tooltip>
                </Column>
            </form>
        </Box>
    );
}

export default SourceDocUploadForm;
