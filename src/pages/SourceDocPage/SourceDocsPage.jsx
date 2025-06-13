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
import log from '../../utils/logger';

export default function SourceDocsPage() {
    const { docs = [], loading, error, refresh } = useSourceDocuments();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    // Log when the page loads
    React.useEffect(() => {
        log.info('SourceDocsPage mounted');
        return () => log.info('SourceDocsPage unmounted');
    }, []);

    // Log when documents are loaded or error occurs
    React.useEffect(() => {
        if (loading) log.info('Loading source documents...');
        if (error) log.error('Error loading source documents:', error);
        if (!loading && docs.length > 0) log.info(`Loaded ${docs.length} source documents`);
    }, [loading, error, docs]);

    // Filter documents based on search input
    const filteredDocs = useFilteredList(docs, search, 'title');

    // Use doc.id for navigation
    const handleSourceDocClick = id => {
        log.info(`Navigating to source document with id: ${id}`);
        navigate(`/sourceDocs/${id}`);
    };

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
            if (!docId) {
                log.error('No document ID provided for deletion.');
                throw new Error('No document ID provided for deletion.');
            }
            try {
                log.info(`Attempting to delete source document with id: ${docId}`);
                await deleteSourceDocument(docId);
                log.info(`Successfully deleted source document with id: ${docId}`);
                refresh();
            } catch (e) {
                log.error('Error deleting source document:', e.message);
                // Custom error for MetaText records
                if (e.message.includes('MetaText records exist')) {
                    log.warn('Cannot delete: MetaText records exist for this document.');
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
            />
        </EntityManagerPage>
    );
}
