import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import FileUploadWidget from '../../components/FileUploadWidget';
import { createSourceDocument } from '../../services/sourceDocumentService';
import { uploadFormContainer, uploadFormInner } from '../../styles/pageStyles';
import log from '../../utils/logger';

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

    React.useEffect(() => {
        log.info('SourceDocUploadForm mounted');
        return () => log.info('SourceDocUploadForm unmounted');
    }, []);

    return (
        <Box sx={uploadFormContainer}>
            <Typography variant="h5" gutterBottom>New Source Document</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={uploadFormInner}>
                <FileUploadWidget file={file} onFileChange={handleFileChange} />
                <TextField
                    data-testid="upload-title"
                    id="upload-title"
                    label="Title"
                    type="text"
                    value={uploadTitle}
                    onChange={handleTitleChange}
                    fullWidth
                    size="small"
                    required
                />
                <Button
                    type="submit"
                    disabled={uploadLoading}
                    fullWidth
                >
                    {uploadLoading ? 'Uploading...' : 'Upload'}
                </Button>
                {uploadError && (
                    <Alert severity="error" m={2}>{uploadError}</Alert>
                )}
                {uploadSuccess && (
                    <Alert severity="success" m={2}>{uploadSuccess}</Alert>
                )}
            </Box>
        </Box>
    );
}
