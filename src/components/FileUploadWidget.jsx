import React from 'react';
import { Box, Button } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
/**
 * FileUploadWidget
 * Props:
 * - file: File | null
 * - onFileChange: (event) => void
 * - accept: string (optional, default: ".txt")
 * - id: string (optional, default: "file-upload")
 */
export default function FileUploadWidget({ file, onFileChange, accept = ".txt", id = "file-upload" }) {

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
                <Button component="span" startIcon={<FileUploadIcon />} sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'text.primary', '&:hover': { backgroundColor: 'secondary.main' } }}>
                    {file ? 'Change File' : 'Choose File'}
                </Button>
            </label>
            {file && <span className="file-name">{file.name}</span>}
        </Box>
    );
}
