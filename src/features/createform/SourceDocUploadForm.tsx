import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import FileUploadWidget from './components/FileUploadWidget';
import { createSourceDocument } from '../services/sourceDocumentService';
import { uploadFormContainer, uploadFormInner } from '../styles/pageStyles';
import log from '../utils/logger';

export interface SourceDocUploadFormProps {
    refresh?: () => void;
}

const SourceDocUploadForm: React.FC<SourceDocUploadFormProps> = ({ refresh }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadTitle, setUploadTitle] = useState<string>('');
    const [uploadError, setUploadError] = useState<string>('');
    const [uploadSuccess, setUploadSuccess] = useState<string>('');
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files ? e.target.files[0] : null);
        setUploadError('');
        setUploadSuccess('');
    };
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setUploadTitle(e.target.value);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploadError('');
        setUploadSuccess('');
        setUploadLoading(true);
        try {
            if (!file) {
                setUploadError('Please select a file to upload.');
                setUploadLoading(false);
                return;
            }
            await createSourceDocument(uploadTitle, file);
            setUploadSuccess('Upload successful!');
            setFile(null);
            setUploadTitle('');
            if (typeof refresh === 'function') refresh();
        } catch (err: any) {
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
        <Paper elevation={3} sx={uploadFormContainer}>
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
                    required
                    disabled={uploadLoading}
                />
                {uploadError && <Alert severity="error" sx={{ mt: 2 }}>{uploadError}</Alert>}
                {uploadSuccess && <Alert severity="success" sx={{ mt: 2 }}>{uploadSuccess}</Alert>}
                <Button type="submit" variant="contained" disabled={uploadLoading || !uploadTitle.trim() || !file} sx={{ mt: 2 }}>
                    {uploadLoading ? 'Uploading...' : 'Upload'}
                </Button>
            </Box>
        </Paper>
    );
};

export default SourceDocUploadForm;
