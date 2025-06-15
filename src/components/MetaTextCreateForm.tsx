import React, { useState } from 'react';
import { Box, Button, TextField, Alert, Typography, Paper } from '@mui/material';
import SourceDocSelect from './SourceDocSelect';
import { createMetaText } from '../services/metaTextService';
import { uploadFormContainer, uploadFormInner } from '../styles/pageStyles';
import log from '../utils/logger';

export interface MetaTextCreateFormProps {
    sourceDocs: Array<{ id: string | number; title: string }>;
    sourceDocsLoading: boolean;
    sourceDocsError: string | null;
    onCreateSuccess?: () => void;
}

const MetaTextCreateForm: React.FC<MetaTextCreateFormProps> = ({
    sourceDocs,
    sourceDocsLoading,
    sourceDocsError,
    onCreateSuccess
}) => {
    const [selectedSourceDocId, setSelectedSourceDocId] = useState<string>('');
    const [metaTextTitle, setMetaTextTitle] = useState<string>('');
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const [createError, setCreateError] = useState<string>('');
    const [createSuccessMsg, setCreateSuccessMsg] = useState<string>('');

    React.useEffect(() => {
        log.info('MetaTextCreateForm mounted');
        return () => log.info('MetaTextCreateForm unmounted');
    }, []);

    const handleCreateMetaText = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccessMsg('');
        setCreateLoading(true);
        try {
            const sourceDocIdNum = Number(selectedSourceDocId);
            if (isNaN(sourceDocIdNum)) {
                throw new Error('Please select a valid source document.');
            }
            await createMetaText(sourceDocIdNum, metaTextTitle);
            setSelectedSourceDocId('');
            setMetaTextTitle('');
            setCreateSuccessMsg('Meta-text created!');
            if (typeof onCreateSuccess === 'function') onCreateSuccess();
        } catch (err: any) {
            let errorMsg = 'Failed to create meta text';
            if (err) {
                if (typeof err === 'string') {
                    errorMsg = `Failed to create meta text: ${err}`;
                } else if (err.message) {
                    errorMsg = `Failed to create meta text: ${err.message}`;
                } else if (err.response && err.response.detail) {
                    errorMsg = `Failed to create meta text: ${err.response.detail}`;
                } else if (err.response) {
                    errorMsg = `Failed to create meta text: ${JSON.stringify(err.response)}`;
                } else {
                    errorMsg = `Failed to create meta text: ${JSON.stringify(err)}`;
                }
            }
            setCreateError(errorMsg);
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={uploadFormContainer}>
            <Typography variant="h5" gutterBottom>New Meta Text</Typography>
            <Box component="form" onSubmit={handleCreateMetaText} sx={uploadFormInner}>
                <SourceDocSelect
                    value={selectedSourceDocId}
                    onChange={e => setSelectedSourceDocId(e.target.value)}
                    sourceDocs={sourceDocs}
                    loading={sourceDocsLoading}
                    error={sourceDocsError}
                    required
                />
                <TextField
                    data-testid="meta-text-title"
                    id="meta-text-title"
                    label="Meta Text Title"
                    type="text"
                    value={metaTextTitle}
                    onChange={e => setMetaTextTitle(e.target.value)}
                    fullWidth
                    required
                    disabled={createLoading}
                />
                {createError && <Alert severity="error" sx={{ mt: 2 }}>{createError}</Alert>}
                {createSuccessMsg && <Alert severity="success" sx={{ mt: 2 }}>{createSuccessMsg}</Alert>}
                <Button type="submit" variant="contained" disabled={createLoading || !metaTextTitle.trim() || !selectedSourceDocId} sx={{ mt: 2 }}>
                    {createLoading ? 'Creating...' : 'Create'}
                </Button>
            </Box>
        </Paper>
    );
};

export default MetaTextCreateForm;
