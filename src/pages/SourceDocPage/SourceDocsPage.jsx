import React, { useState } from 'react';
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
import { useFilteredList } from '../../hooks/useFilteredList';
import { outerList } from '../../styles/pageStyles';

export default function SourceDocsPage() {
    const { docs = [], loading, error, refresh } = useSourceDocuments();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    // Filter documents based on search input
    const filteredDocs = useFilteredList(docs, search, 'title');

    // Use doc.id for navigation
    const handleSourceDocClick = id => navigate(`/sourceDocs/${id}`);

    // Use generic delete hook
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
            />
            {loading ? (
                <Box>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (

                <Box sx={outerList}>
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
