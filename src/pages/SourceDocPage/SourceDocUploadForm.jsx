import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import FileUploadWidget from '../../components/FileUploadWidget';
import { createSourceDocument } from '../../services/sourceDocumentService';

export default function SourceDocUploadForm({ onUploadSuccess, refresh }) {
    const [file, setFile] = useState(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);

    const handleFileChange = e => {
        setFile(e.target.files[0]);
        setUploadError('');
        setUploadSuccess('');
    };
    const handleTitleChange = e => setUploadTitle(e.target.value);

    const handleSubmit = async e => {
        e.preventDefault();
        setUploadError('');
        setUploadSuccess('');
        setUploadLoading(true);
        try {
            await createSourceDocument(uploadTitle, file);
            setUploadSuccess('Upload successful!');
            setFile(null);
            setUploadTitle('');
            if (typeof refresh === 'function') refresh();
            if (typeof onUploadSuccess === 'function') onUploadSuccess();
        } catch (err) {
            if (err.message === 'Title already exists.') {
                setUploadError('A document with this title already exists.');
            } else {
                setUploadError(err.message);
            }
        } finally {
            setUploadLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="h5" gutterBottom>New Source Document</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                <FileUploadWidget file={file} onFileChange={handleFileChange} />
                <Typography variant="subtitle1" component="label" htmlFor="upload-title">
                    Title
                </Typography>
                <TextField
                    id="upload-title"
                    type="text"
                    value={uploadTitle}
                    onChange={handleTitleChange}
                    fullWidth
                    size="small"
                    margin="dense"
                    required
                    sx={{ mt: 1 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={uploadLoading}
                    fullWidth
                >
                    {uploadLoading ? 'Uploading...' : 'Upload'}
                </Button>
                {uploadError && (
                    <Alert severity="error" sx={{ mt: 2 }}>{uploadError}</Alert>
                )}
                {uploadSuccess && (
                    <Alert severity="success" sx={{ mt: 2 }}>{uploadSuccess}</Alert>
                )}
            </Box>
        </Box>
    );
}
