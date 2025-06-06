import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EntityManagerPage from '../../components/EntityManagerPage';
import SourceDocUploadForm from './SourceDocUploadForm';
import { deleteSourceDocument } from '../../services/sourceDocumentService';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import SearchBar from '../../components/SearchBar';
import GeneralizedList from '../../components/GeneralizedList';
import { CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';

export default function SourceDocsPage() {
    const { docs = [], loading, error, refresh } = useSourceDocuments();
    const [search, setSearch] = useState('');
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteError, setDeleteError] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const navigate = useNavigate();

    // Create options for the search bar from document titles
    const docOptions = useMemo(() => docs.map(doc => doc.title), [docs]);

    // Filter documents based on search input
    const filteredDocs = useMemo(() => {
        if (!search) return docs;
        return docs.filter(doc => (doc.title || '').toLowerCase().includes(search.toLowerCase()));
    }, [docs, search]);

    // Handle document deletion
    const handleDelete = async (docId) => {
        setDeleteLoading(prev => ({ ...prev, [docId]: true }));
        setDeleteError(prev => ({ ...prev, [docId]: null }));
        try {
            if (!docId) throw new Error('No document ID provided for deletion.');
            await deleteSourceDocument(docId);
            refresh(); // Refresh the docs list from backend
        } catch (e) {
            // Handle cannot delete if MetaText exists (400)
            if (e.message.includes('MetaText records exist')) {
                setDeleteError(prev => ({ ...prev, [docId]: 'Cannot delete: MetaText records exist for this document.' }));
            } else {
                setDeleteError(prev => ({ ...prev, [docId]: e.message || 'Error deleting document' }));
            }
        } finally {
            setDeleteLoading(prev => ({ ...prev, [docId]: false }));
        }
    };

    // Use doc.id for navigation
    const handleSourceDocClick = id => navigate(`/sourceDocs/${id}`);

    // Handle delete confirmation dialog
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
            handleDelete(pendingDeleteId);
        }
        setConfirmOpen(false);
        setPendingDeleteId(null);
    };

    return (
        <EntityManagerPage>
            <SourceDocUploadForm refresh={refresh} />
            <SearchBar
                label="Search Documents"
                value={search}
                onChange={setSearch}
                options={docOptions}
                sx={{ mb: 2 }}
            />
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, mb: 2 }}>
                    <nav aria-label="entity list">
                        <GeneralizedList
                            items={filteredDocs}
                            onItemClick={handleSourceDocClick}
                            onDeleteClick={handleDeleteClick}
                            deleteLoading={deleteLoading}
                            deleteError={deleteError}
                            emptyMessage="No documents found."
                        />
                    </nav>
                </Box>
            )}
            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Delete Source Document?</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this source document? This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>
        </EntityManagerPage>
    );
}
