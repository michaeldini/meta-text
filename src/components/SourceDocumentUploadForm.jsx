import React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileName from './FileName';
import { TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';

export default function SourceDocumentUploadForm({
    file,
    uploadLabel,
    uploadError,
    uploadSuccess,
    uploadLoading,
    onFileChange,
    onLabelChange,
    onSubmit
}) {
    return (
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>New Source Document</Typography>
            <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".txt"
                        onChange={onFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload">
                        <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                            {file ? 'Change File' : 'Upload File'}
                        </Button>
                    </label>
                    <FileName name={file && file.name} />
                </Box>
                <TextField
                    label="Title"
                    variant="outlined"
                    value={uploadLabel}
                    onChange={onLabelChange}
                    size="small"
                    sx={{ flexGrow: 1, minWidth: 180 }}
                />
                <Button type="submit" variant="contained" color="primary" disabled={uploadLoading}>
                    {uploadLoading ? 'Uploading...' : 'Upload'}
                </Button>
                {uploadError && (
                    <Box sx={{ minWidth: 200 }}>
                        <Alert severity="error" sx={{ py: 0.5, px: 2, fontSize: 14 }}>{uploadError}</Alert>
                    </Box>
                )}
                {uploadSuccess && (
                    <Box sx={{ minWidth: 200 }}>
                        <Alert severity="success" sx={{ py: 0.5, px: 2, fontSize: 14 }}>{uploadSuccess}</Alert>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}
