import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Alert, Box } from '@mui/material';
import PageContainer from '../../components/PageContainer';
import SearchableList from '../../components/SearchableList';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import useListDeleteWithConfirmation from '../../hooks/useListDeleteWithConfirmation';
import MetaTextCreateForm from '../../components/MetaTextCreateForm';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import { useMetaTexts } from '../../hooks/useMetaTexts';
import { deleteMetaText } from '../../services/metaTextService';
import log from '../../utils/logger';


async function handleMetaTextDelete(id, refresh, log) {
    if (!id) {
        log.error('No meta text ID provided for deletion.');
        throw new Error('No meta text ID provided for deletion.');
    }
    try {
        log.info(`Attempting to delete meta text with id: ${id}`);
        await deleteMetaText(id);
        log.info(`Successfully deleted meta text with id: ${id}`);
        refresh();
    } catch (e) {
        log.error('Error deleting meta text:', e.message);
        throw e;
    }
}

export default function MetaTextPage() {
    const { docs: sourceDocs, loading: sourceDocsLoading, error: sourceDocsError } = useSourceDocuments();
    const { metaTexts, metaTextsLoading, metaTextsError, refresh } = useMetaTexts();
    const navigate = useNavigate();

    // Log when the page loads
    React.useEffect(() => {
        log.info('MetaTextPage mounted');
        return () => log.info('MetaTextPage unmounted');
    }, []);

    // Log when meta texts are loaded or error occurs
    React.useEffect(() => {
        if (metaTextsLoading) log.info('Loading meta texts...');
        if (metaTextsError) log.error('Error loading meta texts:', metaTextsError);
        if (!metaTextsLoading && metaTexts && metaTexts.length > 0) log.info(`Loaded ${metaTexts.length} meta texts`);
    }, [metaTextsLoading, metaTextsError, metaTexts]);

    // Log when source docs are loaded or error occurs
    React.useEffect(() => {
        if (sourceDocsLoading) log.info('Loading source documents for MetaTextPage...');
        if (sourceDocsError) log.error('Error loading source documents:', sourceDocsError);
        if (!sourceDocsLoading && sourceDocs && sourceDocs.length > 0) log.info(`Loaded ${sourceDocs.length} source documents for MetaTextPage`);
    }, [sourceDocsLoading, sourceDocsError, sourceDocs]);

    const handleMetaTextClick = id => {
        log.info(`Navigating to meta text with id: ${id}`);
        navigate(`/metaText/${id}`);
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
    } = useListDeleteWithConfirmation((id) => handleMetaTextDelete(id, refresh, log));

    // Get the name of the item to delete for dialog
    const deleteItemName = targetId
        ? (metaTexts?.find(item => item.id === targetId)?.title || 'this item')
        : '';

    return (
        <PageContainer>
            <MetaTextCreateForm
                sourceDocs={sourceDocs}
                sourceDocsLoading={sourceDocsLoading}
                sourceDocsError={sourceDocsError}
                onCreateSuccess={refresh}
            />
            {metaTextsLoading ? (
                <Box>
                    <CircularProgress />
                </Box>
            ) : metaTextsError ? (
                <Alert severity="error">{metaTextsError}</Alert>
            ) : (
                <SearchableList
                    items={metaTexts}
                    onItemClick={handleMetaTextClick}
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
