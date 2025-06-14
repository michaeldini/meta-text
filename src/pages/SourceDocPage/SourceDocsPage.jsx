import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Alert, Box } from '@mui/material';
import PageContainer from '../../components/PageContainer';
import SearchableList from '../../components/SearchableList';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import useListDeleteWithConfirmation from '../../hooks/useListDeleteWithConfirmation';
import SourceDocUploadForm from './SourceDocUploadForm';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import { deleteSourceDocument } from '../../services/sourceDocumentService';
import log from '../../utils/logger';

async function handleSourceDocDelete(docId, refresh, log) {
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

export default function SourceDocsPage() {
    const { docs = [], loading, error, refresh } = useSourceDocuments();
    const navigate = useNavigate();

    React.useEffect(() => {
        log.info('SourceDocsPage mounted');
        return () => log.info('SourceDocsPage unmounted');
    }, []);

    React.useEffect(() => {
        if (loading) log.info('Loading source documents...');
        if (error) log.error('Error loading source documents:', error);
        if (!loading && docs.length > 0) log.info(`Loaded ${docs.length} source documents`);
    }, [loading, error, docs]);

    const handleSourceDocClick = id => {
        log.info(`Navigating to source document with id: ${id}`);
        navigate(`/sourceDocs/${id}`);
    };

    // Use new centralized delete-with-confirmation hook
    const {
        dialogOpen,
        targetId,
        loading: deleteLoading,
        error: deleteError,
        handleDeleteClick,
        handleDialogClose,
        handleDialogConfirm,
    } = useListDeleteWithConfirmation((docId) => handleSourceDocDelete(docId, refresh, log));

    const deleteItemName = targetId
        ? (docs.find(item => item.id === targetId)?.title || 'this item')
        : '';

    return (
        <PageContainer>
            <SourceDocUploadForm refresh={refresh} />
            {loading ? (
                <Box>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <SearchableList
                    items={docs}
                    onItemClick={handleSourceDocClick}
                    onDeleteClick={handleDeleteClick}
                    deleteLoading={deleteLoading}
                    deleteError={deleteError}
                    filterKey="title"
                />
            )}
            <DeleteConfirmationDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                onConfirm={handleDialogConfirm}
                title={`Delete "${deleteItemName}"?`}
                text={`Are you sure you want to delete "${deleteItemName}"? This action cannot be undone.`}
            />
        </PageContainer>
    );
}
