import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EntityManagerPage from '../../components/EntityManagerPage';
import SourceDocUploadForm from './SourceDocUploadForm';
import { deleteSourceDocument } from '../../services/sourceDocumentService';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import SearchBar from '../../components/SearchBar';
import GeneralizedList from '../../components/GeneralizedList';
import { CircularProgress, Alert, Box } from '@mui/material';
import useDeleteWithConfirmation from '../../hooks/useDeleteWithConfirmation';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';

export default function SourceDocsPage() {
    const { docs = [], loading, error, refresh } = useSourceDocuments();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    // Create options for the search bar from document titles
    const docOptions = useMemo(() => docs.map(doc => doc.title), [docs]);

    // Filter documents based on search input
    const filteredDocs = useMemo(() => {
        if (!search) return docs;
        return docs.filter(doc => (doc.title || '').toLowerCase().includes(search.toLowerCase()));
    }, [docs, search]);

    // Use doc.id for navigation
    const handleSourceDocClick = id => navigate(`/sourceDocs/${id}`);

    // Use generic delete hook (omit unused pendingDeleteId)
    const {
        deleteLoading,
        deleteError,
        confirmOpen,
        handleDeleteClick,
        handleConfirmClose,
        handleConfirmDelete,
    } = useDeleteWithConfirmation(
        async (docId) => {
            if (!docId) throw new Error('No document ID provided for deletion.');
            try {
                await deleteSourceDocument(docId);
                refresh();
            } catch (e) {
                // Custom error for MetaText records
                if (e.message.includes('MetaText records exist')) {
                    throw new Error('Cannot delete: MetaText records exist for this document.');
                }
                throw e;
            }
        }
    );

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
            <DeleteConfirmationDialog
                open={confirmOpen}
                onClose={handleConfirmClose}
                onConfirm={handleConfirmDelete}
                title="Delete Source Document?"
                text="Are you sure you want to delete this source document? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </EntityManagerPage>
    );
}
