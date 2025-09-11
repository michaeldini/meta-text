import { HiArrowDownTray } from 'react-icons/hi2';
// SourceDocFilePicker: encapsulates the file selection + status list for source document uploads
// This keeps the parent form lean and makes the picker independently testable.
import * as React from 'react';
import { useRef, useCallback } from 'react';
import { styled, Stack, Box, Text } from '@styles';
import UploadFileStatusList, { UploadStatus } from './UploadFileStatusList';

// Use shared primitives
const Column = styled(Stack, { maxWidth: '320px' });

const Dropzone = styled(Box, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '18px',
    borderRadius: 8,
    border: '1px dashed $colors$gray400',
    background: 'transparent',
    cursor: 'pointer',
    outline: 'none',
    transition: 'box-shadow 120ms ease, border-color 120ms ease',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
    '&:focus-visible': {
        boxShadow: '0 0 0 3px hsla(200,100%,50%,0.08)',
    },
    variants: {
        $disabled: {
            true: { opacity: 0.6, cursor: 'not-allowed' },
            false: {},
        },
    },
});

const PrimaryText = styled(Text, {
    fontSize: '0.98rem',
    fontWeight: 600,
    color: '$colors$tooltipText',
});

const SecondaryText = styled(Text, {
    fontSize: '0.85rem',
    color: '$colors$gray500',
    maxWidth: '320px',
});

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
    const MAX_FILES = 100;
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

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
        <Column>
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
                <PrimaryText aria-live="polite">{selectedCountLabel}</PrimaryText>
                <SecondaryText aria-live="polite">{selectedFilesDetail}</SecondaryText>
            </Dropzone>

            <UploadFileStatusList files={files} statuses={uploadStatuses} />
        </Column>
    );
}

export default SourceDocFilePicker;
