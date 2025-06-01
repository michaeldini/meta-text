import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, Alert } from '@mui/material';
import MetaTextCreateForm from '../../components/MetaTextCreateForm';
import SearchBar from '../../components/SearchBar';
import MetaTextList from '../../components/MetaTextList';
import { useMetaTexts } from '../../hooks/useMetaTexts';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';

export default function MetaTextPage() {
    const [search, setSearch] = useState('');
    const [selectedSource, setSelectedSource] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteError, setDeleteError] = useState({});
    const { metaTexts, metaTextsLoading, metaTextsError } = useMetaTexts([createSuccess]);
    const { docs: sourceDocs, loading: sourceDocsLoading, error: sourceDocsError } = useSourceDocuments();
    const navigate = useNavigate();

    const filteredMetaTexts = useMemo(() => {
        if (!search) return metaTexts;
        return metaTexts.filter(obj => {
            const title = obj.title || '';
            return String(title).toLowerCase().includes(search.toLowerCase());
        });
    }, [metaTexts, search]);

    // Extract options for Autocomplete
    const metaTextOptions = useMemo(() => metaTexts.map(obj => obj.title), [metaTexts]);

    const handleCreate = async e => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccess('');
        setCreateLoading(true);
        try {
            // createMetaText is imported in the old version, but not used here. You may want to move it to a service or keep as is.
            const { createMetaText } = await import('../../services/metaTextService');
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

    // Delete MetaText handler
    const handleDeleteMetaText = async (id) => {
        setDeleteLoading(prev => ({ ...prev, [id]: true }));
        setDeleteError(prev => ({ ...prev, [id]: '' }));
        try {
            const { deleteMetaText } = await import('../../services/metaTextService');
            await deleteMetaText(id);
            setDeleteLoading(prev => ({ ...prev, [id]: false }));
            setDeleteError(prev => ({ ...prev, [id]: '' }));
        } catch (err) {
            setDeleteLoading(prev => ({ ...prev, [id]: false }));
            setDeleteError(prev => ({ ...prev, [id]: err.message || 'Delete failed' }));
        }
    };

    // Navigate to detail page on click
    const handleMetaTextClick = id => navigate(`/metaText/${id}`);

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Meta Texts</Typography>
            <MetaTextCreateForm
                sourceDocs={sourceDocs}
                selectedSource={selectedSource}
                setSelectedSource={setSelectedSource}
                newLabel={newLabel}
                setNewLabel={setNewLabel}
                handleCreate={handleCreate}
                createLoading={createLoading}
                createError={createError}
                createSuccess={createSuccess}
                sourceDocsLoading={sourceDocsLoading}
                sourceDocsError={sourceDocsError}
            />
            <SearchBar
                label="Search Meta Texts"
                value={search}
                onChange={setSearch}
                options={metaTextOptions}
                sx={{ mb: 2 }}
            />
            {metaTextsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : metaTextsError ? (
                <Alert severity="error">{metaTextsError}</Alert>
            ) : (
                <Box>
                    <MetaTextList
                        filteredMetaTexts={filteredMetaTexts}
                        selectedMetaText={null}
                        handleMetaTextClick={handleMetaTextClick}
                        handleDeleteMetaText={handleDeleteMetaText}
                        deleteLoading={deleteLoading}
                        deleteError={deleteError}
                    />
                </Box>
            )}
        </Box>
    );
}
