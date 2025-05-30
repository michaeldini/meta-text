import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSourceDocuments } from '../../services/sourceDocumentService';
import { fetchMetaTexts, createMetaText } from '../../services/metaTextService';
import { TextField, Paper, Typography, List, ListItem, ListItemButton, ListItemText, CircularProgress, Box, Divider, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

export default function MetaTextPage() {
    const navigate = useNavigate();
    const [metaTexts, setMetaTexts] = useState([]);
    const [metaTextsLoading, setMetaTextsLoading] = useState(true);
    const [metaTextsError, setMetaTextsError] = useState('');
    const [search, setSearch] = useState('');
    const [sourceDocs, setSourceDocs] = useState([]);
    const [sourceDocsLoading, setSourceDocsLoading] = useState(true);
    const [sourceDocsError, setSourceDocsError] = useState('');
    const [selectedSource, setSelectedSource] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [createLoading, setCreateLoading] = useState(false);

    // Fetch meta texts
    useEffect(() => {
        setMetaTextsLoading(true);
        setMetaTextsError('');
        fetchMetaTexts()
            .then(data => setMetaTexts(data))
            .catch(e => setMetaTextsError(e.message))
            .finally(() => setMetaTextsLoading(false));
    }, [createSuccess]);

    // Fetch source docs
    useEffect(() => {
        setSourceDocsLoading(true);
        setSourceDocsError('');
        fetchSourceDocuments()
            .then(data => setSourceDocs(data))
            .catch(e => setSourceDocsError(e.message))
            .finally(() => setSourceDocsLoading(false));
    }, []);

    const filteredMetaTexts = useMemo(() => {
        if (!search) return metaTexts;
        return metaTexts.filter(obj => (obj.name || obj).toLowerCase().includes(search.toLowerCase()));
    }, [metaTexts, search]);

    const handleCreate = async e => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccess('');
        setCreateLoading(true);
        try {
            await createMetaText(selectedSource, newLabel);
            setCreateSuccess('Meta-text created!');
            setSelectedSource('');
            setNewLabel('');
        } catch (err) {
            setCreateError(err.message);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleMetaTextClick = name => navigate(`/metaText/${encodeURIComponent(name)}`);

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Meta Texts</Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="source-doc-label">Source Document</InputLabel>
                        <Select
                            labelId="source-doc-label"
                            value={selectedSource}
                            label="Source Document"
                            onChange={e => setSelectedSource(e.target.value)}
                            required
                        >
                            {sourceDocs.map(doc => (
                                <MenuItem key={doc.label || doc} value={doc.label || doc}>{doc.label || doc}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Meta-text Name"
                        value={newLabel}
                        onChange={e => setNewLabel(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" disabled={createLoading}>
                        {createLoading ? 'Creating...' : 'Create'}
                    </Button>
                    {createError && <Typography color="error">{createError}</Typography>}
                    {createSuccess && <Typography color="success.main">{createSuccess}</Typography>}
                </form>
            </Paper>
            <TextField
                label="Search Meta Texts"
                variant="outlined"
                fullWidth
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            />
            {metaTextsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : metaTextsError ? (
                <Typography color="error">{metaTextsError}</Typography>
            ) : (
                <Paper>
                    <List>
                        {filteredMetaTexts.length === 0 && (
                            <ListItem><ListItemText primary="No meta texts found." /></ListItem>
                        )}
                        {filteredMetaTexts.map(obj => {
                            const name = obj.name || obj;
                            return (
                                <React.Fragment key={name}>
                                    <ListItemButton onClick={() => handleMetaTextClick(name)}>
                                        <ListItemText primary={name} />
                                    </ListItemButton>
                                    <Divider />
                                </React.Fragment>
                            );
                        })}
                    </List>
                </Paper>
            )}
        </Box>
    );
}
