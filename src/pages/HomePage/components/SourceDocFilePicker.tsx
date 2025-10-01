import { HiArrowDownTray } from 'react-icons/hi2';
// SourceDocFilePicker: encapsulates the file selection + status list for source document uploads
// This keeps the parent form lean and makes the picker independently testable.
import * as React from 'react';
import { useRef, useCallback } from 'react';
import { Dropzone, Box, Text } from '@styles';
import UploadFileStatusList, { UploadStatus } from './UploadFileStatusList';

const MAX_FILES = 100;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export interface SourceDocFilePickerProps {
    files: File[];
    disabled?: boolean;
    onFilesChange: (files: File[]) => void;
    uploadStatuses: UploadStatus[];
}

export function SourceDocFilePicker({
    files,
    disabled = false,
    onFilesChange,
    uploadStatuses,
}: SourceDocFilePickerProps) {
    const fileCount = files.length;
    const selectedCountLabel = fileCount
        ? `${fileCount} file${fileCount > 1 ? 's' : ''} selected`
        : 'Drag & drop or click to select .txt files';
    const selectedFilesDetail = fileCount
        ? files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join(', ')
        : 'Only .txt files are allowed';

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFiles = useCallback((incoming: File[]) => {
        if (!incoming || incoming.length === 0) return;
        // filter to .txt and size limits
        const accepted = incoming
            .filter((f, i) => i < MAX_FILES)
            .filter(f => f.name.toLowerCase().endsWith('.txt') && f.size <= MAX_FILE_SIZE);
        if (accepted.length) onFilesChange(accepted);
    }, [onFilesChange]);

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        if (!e.target.files) return;
        handleFiles(Array.from(e.target.files));
        // clear so same file can be re-selected
        e.currentTarget.value = '';
    };

    const onDrop: React.DragEventHandler<HTMLDivElement> = e => {
        e.preventDefault();
        if (disabled) return;
        if (e.dataTransfer?.files) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const onDragOver: React.DragEventHandler = e => { e.preventDefault(); };

    const openFilePicker = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    return (
        <Box css={{ maxWidth: '320px' }}>
            <input
                ref={inputRef}
                data-testid="file-input"
                aria-label="Select text files to upload"
                type="file"
                accept=".txt"
                multiple
                onChange={onInputChange}
                style={{ display: 'none' }}
                disabled={disabled}
            />

            <Dropzone
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={openFilePicker}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openFilePicker(); } }}
                onDrop={onDrop}
                onDragOver={onDragOver}
                aria-disabled={disabled}
                $disabled={disabled}
            >
                <HiArrowDownTray size={36} />
                <Text tone="subtle" aria-live="polite">{selectedCountLabel}</Text>
                <Text tone="subtle" aria-live="polite">{selectedFilesDetail}</Text>
            </Dropzone>

            <UploadFileStatusList files={files} statuses={uploadStatuses} />
        </Box>
    );
}

export default SourceDocFilePicker;
