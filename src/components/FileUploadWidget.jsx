import React from 'react';
import { Box, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <input
                id={id}
                type="file"
                accept={accept}
                onChange={onFileChange}
                style={{ display: 'none' }}
            />
            <label htmlFor={id}>
                <Button component="span" startIcon={<FileUploadIcon />} sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'text.primary', '&:hover': { backgroundColor: 'secondary.main' } }}>
                    {file ? 'Change File' : 'Upload File'}
                </Button>
            </label>
            {file && <span className="file-name">{file.name}</span>}
        </Box>
    );
}
