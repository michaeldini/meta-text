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

export default function MetaTextPage() {
    const [createSuccess, setCreateSuccess] = useState('');
    const { docs: sourceDocs, loading: sourceDocsLoading, error: sourceDocsError } = useSourceDocuments();
    const { data: metaTexts, loading: metaTextsLoading, error: metaTextsError } = useMetaTexts([createSuccess]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const {
        deleteLoading,
        deleteError,
        confirmOpen,
        handleDeleteClick,
        handleConfirmClose,
        handleConfirmDelete,
    } = useDeleteWithConfirmation(
        async (id) => {
            await deleteMetaText(id);
            setCreateSuccess(Date.now());
        }
    );

    const filteredMetaTexts = useFilteredList(metaTexts, search, 'title');

    const handleMetaTextClick = id => navigate(`/metaText/${id}`);

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
