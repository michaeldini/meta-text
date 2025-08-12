// SourceDocFilePicker: encapsulates the file selection + status list for source document uploads
// This keeps the parent form lean and makes the picker independently testable.
import React from 'react';
import { Stack } from '@chakra-ui/react/stack';
import { Text } from '@chakra-ui/react';
import { FileUpload } from '@chakra-ui/react/file-upload';
import UploadFileStatusList, { UploadStatus } from './UploadFileStatusList';
import { Icon } from '@components/icons/Icon';

export interface SourceDocFilePickerProps {
    files: File[];
    disabled?: boolean;
    onFilesChange: (files: File[]) => void;
    uploadStatuses: UploadStatus[];
}

export const SourceDocFilePicker: React.FC<SourceDocFilePickerProps> = ({
    files,
    disabled = false,
    onFilesChange,
    uploadStatuses,
}) => {
    const fileCount = files.length;
    const selectedCountLabel = fileCount
        ? `${fileCount} file${fileCount > 1 ? 's' : ''} selected`
        : 'Drag & drop or click to select .txt files';
    const selectedFilesDetail = fileCount
        ? files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join(', ')
        : 'Only .txt files are allowed';

    return (
        <Stack>
            <FileUpload.Root
                accept={[".txt"]}
                maxFiles={100}
                maxFileSize={50 * 1024 * 1024}
                onFileChange={({ acceptedFiles }) => acceptedFiles && onFilesChange(acceptedFiles)}
                disabled={disabled}
                required
                alignItems="center"
                aria-disabled={disabled}
            >
                <FileUpload.HiddenInput data-testid="file-input" aria-label="Select text files to upload" />
                <FileUpload.Dropzone bg="none">
                    <FileUpload.DropzoneContent>
                        <Icon name='Download' />
                        <Text aria-live="polite">{selectedCountLabel}</Text>
                        <Text fontSize="sm" color="fg.muted" aria-live="polite">{selectedFilesDetail}</Text>
                    </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
            </FileUpload.Root>
            <UploadFileStatusList files={files} statuses={uploadStatuses} />
        </Stack>
    );
};

export default SourceDocFilePicker;
