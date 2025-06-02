import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Paper } from '@mui/material';
import { createMetaText } from '../services/metaTextService';
import SourceDocSelect from './SourceDocSelect';

function MetaTextCreateForm({
    sourceDocs,
    sourceDocsLoading = false,
    sourceDocsError = null,
    setCreateSuccess
}) {
    const [selectedSourceDocId, setSelectedSourceDocId] = useState('');
    const [title, setTitle] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');
    const [localSuccess, setLocalSuccess] = useState('');

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreateError('');
        setLocalSuccess('');
        setCreateLoading(true);

        try {
            console.log('Creating meta-text with payload:', { sourceDocId: selectedSourceDocId, title });
            await createMetaText(selectedSourceDocId, title);
            setLocalSuccess('Meta-text created!');
            setCreateSuccess && setCreateSuccess(Date.now()); // Use timestamp for uniqueness
            setSelectedSourceDocId('');
            setTitle('');
        } catch (err) {
            let errorMsg = 'Failed to create meta text';
            if (err) {
                if (typeof err === 'string') {
                    errorMsg = err;
                } else if (err.message) {
                    errorMsg = err.message;
                } else if (err.response && err.response.data && err.response.data.detail) {
                    errorMsg = err.response.data.detail;
                } else if (err.response && err.response.data) {
                    errorMsg = JSON.stringify(err.response.data);
                } else {
                    errorMsg = JSON.stringify(err);
                }
            }
            setCreateError(errorMsg);
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <SourceDocSelect
                    value={selectedSourceDocId}
                    onChange={e => setSelectedSourceDocId(e.target.value)}
                    sourceDocs={sourceDocs}
                    loading={sourceDocsLoading}
                    error={sourceDocsError}
                    required
                />
                <TextField
                    label="Meta-text Name"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    sx={{ flexGrow: 1, minWidth: 180 }}
                />
                <Button type="submit" variant="contained" disabled={createLoading} sx={{ minWidth: 120 }}>
                    {createLoading ? 'Creating...' : 'Create'}
                </Button>
                {createError && <Alert severity="error" sx={{ ml: 2 }}>{createError}</Alert>}
                {localSuccess && <Alert severity="success" sx={{ ml: 2 }}>{localSuccess}</Alert>}
            </Box>
        </Paper>
    );
}

export default MetaTextCreateForm;
