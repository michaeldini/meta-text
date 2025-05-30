import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Alert, Paper, Typography } from '@mui/material';

function MetaTextCreateForm({
    sourceDocs,
    selectedSource,
    setSelectedSource,
    newLabel,
    setNewLabel,
    handleCreate,
    createLoading,
    createError,
    createSuccess,
    sourceDocsLoading = false,
    sourceDocsError = null
}) {
    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }} disabled={sourceDocsLoading || !!sourceDocsError}>
                    <InputLabel id="source-doc-label">Source Document</InputLabel>
                    <Select
                        labelId="source-doc-label"
                        value={selectedSource}
                        label="Source Document"
                        onChange={e => setSelectedSource(e.target.value)}
                        required
                    >
                        {sourceDocsLoading ? (
                            <MenuItem value="" disabled>Loading...</MenuItem>
                        ) : sourceDocsError ? (
                            <MenuItem value="" disabled>Error loading documents</MenuItem>
                        ) : sourceDocs.length === 0 ? (
                            <MenuItem value="" disabled>No documents found</MenuItem>
                        ) : (
                            sourceDocs.map((doc, idx) => {
                                let key, value, label;
                                if (typeof doc === 'object' && doc !== null) {
                                    key = doc.id || idx;
                                    value = doc.title || String(idx); // use title as value
                                    label = doc.title || String(idx);
                                } else {
                                    key = doc;
                                    value = doc;
                                    label = doc;
                                }
                                return (
                                    <MenuItem key={key} value={value}>{label}</MenuItem>
                                );
                            })
                        )}
                    </Select>
                </FormControl>
                <TextField
                    label="Meta-text Name"
                    variant="outlined"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    required
                    sx={{ flexGrow: 1, minWidth: 180 }}
                />
                <Button type="submit" variant="contained" disabled={createLoading} sx={{ minWidth: 120 }}>
                    {createLoading ? 'Creating...' : 'Create'}
                </Button>
                {createError && <Alert severity="error" sx={{ ml: 2 }}>{createError}</Alert>}
                {createSuccess && <Alert severity="success" sx={{ ml: 2 }}>{createSuccess}</Alert>}
            </Box>
        </Paper>
    );
}

export default MetaTextCreateForm;
