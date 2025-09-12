import { HiArrowDownTray } from 'react-icons/hi2';
// SourceDocUploadForm: main form wrapper orchestrating file picker + submission
import * as React from 'react';
// UI (migrated from Chakra -> Stitches)
import { styled, Panel as Container, Heading, Stack, Button } from '@styles';
import { ErrorAlert } from '@components/ErrorAlert';
import SourceDocFilePicker from './SourceDocFilePicker';

// Hook
import { useSourceDocUploadForm } from './useSourceDocUploadForm';

const HeadingStyled = Heading;
const StackCol = Stack;
const SubmitButton = Button;

function SourceDocUploadForm(): React.ReactElement {
    const { files, error, addSourceDocuments, handleFilesChange, handleSubmit, uploadStatuses } = useSourceDocUploadForm();
    const isPending = addSourceDocuments.isPending;

    return (
        <Container>
            <HeadingStyled>Upload</HeadingStyled>
            <ErrorAlert message={error} title="Upload failed" data-testid="upload-error" />
            <form onSubmit={handleSubmit} aria-busy={isPending}>
                <StackCol>
                    <SourceDocFilePicker
                        files={files}
                        disabled={isPending}
                        onFilesChange={handleFilesChange}
                        uploadStatuses={uploadStatuses}
                    />
                    <SubmitButton
                        type="submit"
                        tone={isPending || !files.length ? 'disabled' : 'primary'}

                        data-testid="submit-button"
                    >
                        {!isPending && <HiArrowDownTray />}
                        {isPending ? 'Uploading...' : 'Upload Documents'}
                    </SubmitButton>
                </StackCol>
            </form>
        </Container>
    );
}

export default SourceDocUploadForm;
