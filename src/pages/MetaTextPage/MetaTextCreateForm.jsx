import React, { useState } from 'react';
import { Box, Button, TextField, Alert, Typography } from '@mui/material';
import SourceDocSelect from '../../components/SourceDocSelect';
import { createMetaText } from '../../services/metaTextService';
import { uploadFormContainer, uploadFormInner } from '../../styles/pageStyles';
import log from '../../utils/logger';

export default function MetaTextCreateForm({
    sourceDocs,
    sourceDocsLoading,
    sourceDocsError,
    onCreateSuccess
}) {
    const [selectedSourceDocId, setSelectedSourceDocId] = useState('');
    const [metaTextTitle, setMetaTextTitle] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');
    const [createSuccessMsg, setCreateSuccessMsg] = useState('');

    React.useEffect(() => {
        log.info('MetaTextCreateForm mounted');
        return () => log.info('MetaTextCreateForm unmounted');
    }, []);

    const handleCreateMetaText = async (e) => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccessMsg('');
        setCreateLoading(true);
        try {
            await createMetaText(selectedSourceDocId, metaTextTitle);
            setSelectedSourceDocId('');
            setMetaTextTitle('');
            setCreateSuccessMsg('Meta-text created!');
            if (typeof onCreateSuccess === 'function') onCreateSuccess();
        } catch (err) {
            let errorMsg = 'Failed to create meta text';
            if (err) {
                if (typeof err === 'string') {
                    errorMsg = err;
                } else if (err.message) {
                    errorMsg = err.message;
                } else if (err.response && err.response.detail) {
                    errorMsg = err.response.detail;
                } else if (err.response) {
                    errorMsg = JSON.stringify(err.response);
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
        <Box sx={uploadFormContainer}>
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
                    label="Meta-text Name"
                    value={metaTextTitle}
                    onChange={e => setMetaTextTitle(e.target.value)}
                    size="small"

                    fullWidth
                    required
                />
                <Button
                    type="submit"
                    disabled={createLoading}
                    fullWidth
                >
                    {createLoading ? 'Creating...' : 'Create'}
                </Button>
                {createError && <Alert severity="error" sx={{ mt: 2 }}>{createError}</Alert>}
                {createSuccessMsg && <Alert severity="success" sx={{ mt: 2 }}>{createSuccessMsg}</Alert>}
            </Box>
        </Box>
    );
}
