import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaTexts } from '../../hooks/useMetaTexts';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import EntityManagerPage from '../../components/EntityManagerPage';
import MetaTextCreateForm from './MetaTextCreateForm';
import SearchBar from '../../components/SearchBar';
import GeneralizedList from '../../components/GeneralizedList';
import { CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';

export default function MetaTextPage() {
    const [createSuccess, setCreateSuccess] = useState('');
    const { docs: sourceDocs, loading: sourceDocsLoading, error: sourceDocsError } = useSourceDocuments();
    const { data: metaTexts, loading: metaTextsLoading, error: metaTextsError } = useMetaTexts([createSuccess]);
    const [search, setSearch] = useState('');
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteError, setDeleteError] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const navigate = useNavigate();

    const filteredMetaTexts = useMemo(() => {
        if (!search) return metaTexts;
        return metaTexts.filter(obj => {
            const title = obj.title || '';
            return String(title).toLowerCase().includes(search.toLowerCase());
        });
    }, [metaTexts, search]);

    const metaTextOptions = useMemo(() => metaTexts.map(obj => obj.title), [metaTexts]);

    const handleDeleteMetaText = async (id) => {
        setDeleteLoading(prev => ({ ...prev, [id]: true }));
        setDeleteError(prev => ({ ...prev, [id]: '' }));
        try {
            const { deleteMetaText } = await import('../../services/metaTextService');
            await deleteMetaText(id);
            setDeleteLoading(prev => ({ ...prev, [id]: false }));
            setDeleteError(prev => ({ ...prev, [id]: '' }));
            setCreateSuccess(Date.now());
        } catch (err) {
            setDeleteLoading(prev => ({ ...prev, [id]: false }));
            setDeleteError(prev => ({ ...prev, [id]: err.message || 'Delete failed' }));
        }
    };

    const handleMetaTextClick = id => navigate(`/metaText/${id}`);
    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setPendingDeleteId(id);
        setConfirmOpen(true);
    };
    const handleConfirmClose = () => {
        setConfirmOpen(false);
        setPendingDeleteId(null);
    };
    const handleConfirmDelete = () => {
        if (pendingDeleteId) {
            handleDeleteMetaText(pendingDeleteId);
        }
        setConfirmOpen(false);
        setPendingDeleteId(null);
    };

    return (
        <EntityManagerPage>
            <MetaTextCreateForm
                sourceDocs={sourceDocs}
                sourceDocsLoading={sourceDocsLoading}
                sourceDocsError={sourceDocsError}
                onCreateSuccess={() => setCreateSuccess(Date.now())}
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
                <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, mb: 2 }}>
                    <nav aria-label="entity list">
                        <GeneralizedList
                            items={filteredMetaTexts}
                            onItemClick={handleMetaTextClick}
                            onDeleteClick={handleDeleteClick}
                            deleteLoading={deleteLoading}
                            deleteError={deleteError}
                            emptyMessage="No meta texts found."
                        />
                    </nav>
                </Box>
            )}
            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Delete Meta Text?</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this meta text? This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>
        </EntityManagerPage>
    );
}
