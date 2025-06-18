import React from 'react';
import { Box, Button } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';

export interface FileUploadWidgetProps {
    file: File | null;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    id?: string;
}

const FileUploadWidget: React.FC<FileUploadWidgetProps> = ({ file, onFileChange, accept = ".txt", id = "file-upload" }) => {
    return (
        <Box sx={{ gap: 2, display: 'flex', flexDirection: 'row', alignItems: 'end' }}>
            <input
                id={id}
                data-testid="file-upload-input"
                type="file"
                accept={accept}
                onChange={onFileChange}
                style={{ display: 'none' }}
            />
            <label htmlFor={id}>
                <Button variant="outlined" component="span" startIcon={<FileUploadIcon />} sx={{ height: '60px', padding: '16px' }}>
                    {file ? 'Change File' : 'Choose File'}
                </Button>
            </label>
            {file && <span className="file-name">{file.name}</span>}
        </Box>
    );
};

export default FileUploadWidget;
