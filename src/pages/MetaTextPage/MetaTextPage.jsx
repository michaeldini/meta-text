import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaTexts } from '../../hooks/useMetaTexts';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import EntityManagerPage from '../../components/EntityManagerPage';
import MetaTextCreateForm from './MetaTextCreateForm';
import SearchBar from '../../components/SearchBar';
import GeneralizedList from '../../components/GeneralizedList';
import { CircularProgress, Alert, Box } from '@mui/material';
import useDeleteWithConfirmation from '../../hooks/useDeleteWithConfirmation';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import { useFilteredList } from '../../hooks/useFilteredList';
import { deleteMetaText } from '../../services/metaTextService';
import { outerList } from '../../styles/pageStyles';
import log from '../../utils/logger';

export default function MetaTextPage() {
    const [createSuccess, setCreateSuccess] = useState('');
    const { docs: sourceDocs, loading: sourceDocsLoading, error: sourceDocsError } = useSourceDocuments();
    const { data: metaTexts, loading: metaTextsLoading, error: metaTextsError } = useMetaTexts([createSuccess]);
    const [search, setSearch] = useState('');
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

    const {
        deleteLoading,
        deleteError,
        confirmOpen,
        handleDeleteClick,
        handleConfirmClose,
        handleConfirmDelete,
    } = useDeleteWithConfirmation(
        async (id) => {
            log.info(`Attempting to delete meta text with id: ${id}`);
            await deleteMetaText(id);
            log.info(`Successfully deleted meta text with id: ${id}`);
            setCreateSuccess(Date.now());
        }
    );

    const filteredMetaTexts = useFilteredList(metaTexts, search, 'title');

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
            />
            {metaTextsLoading ? (
                <Box>
                    <CircularProgress />
                </Box>
            ) : metaTextsError ? (
                <Alert severity="error">{metaTextsError}</Alert>
            ) : (
                <Box sx={outerList}>
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
            <DeleteConfirmationDialog
                open={confirmOpen}
                onClose={handleConfirmClose}
                onConfirm={handleConfirmDelete}
                title="Delete Meta Text?"
                text="Are you sure you want to delete this meta text? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </EntityManagerPage>
    );
}
