import React from 'react';
import { Box, Button } from '@mui/material';
import { FileUploadIcon } from '../../../components/icons';
import { FORM_DEFAULTS, FORM_STYLES, FORM_A11Y } from '../constants';

export interface FileUploadWidgetProps {
    file: File | null;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    id?: string;
}

const FileUploadWidget: React.FC<FileUploadWidgetProps> = React.memo(({
    file,
    onFileChange,
    accept = FORM_DEFAULTS.FILE_ACCEPT,
    id = FORM_A11Y.IDS.FILE_UPLOAD
}) => {
    const inputStyles = {
        gap: FORM_STYLES.FORM_SPACING,
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'end' as const
    };

    const buttonStyles = {
        height: FORM_STYLES.INPUT_HEIGHT,
        padding: FORM_STYLES.STANDARD_PADDING
    };

    return (
        <Box sx={inputStyles}>
            <input
                id={id}
                data-testid="file-upload-input"
                type="file"
                accept={accept}
                onChange={onFileChange}
                style={{ display: 'none' }}
                aria-label={FORM_A11Y.LABELS.FILE_UPLOAD}
            />
            <label htmlFor={id}>
                <Button
                    variant="outlined"
                    component="span"
                    startIcon={<FileUploadIcon />}
                    sx={buttonStyles}
                    aria-describedby={file ? 'selected-file-name' : undefined}
                >
                    {file ? 'Change File' : 'Choose File'}
                </Button>
            </label>
            {file && (
                <span id="selected-file-name" className="file-name">
                    {file.name}
                </span>
            )}
        </Box>
    );
});

export default FileUploadWidget;
