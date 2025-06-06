import React, { useState, useMemo } from 'react';
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
            const { deleteMetaText } = await import('../../services/metaTextService');
            await deleteMetaText(id);
            setCreateSuccess(Date.now());
        }
    );

    const filteredMetaTexts = useMemo(() => {
        if (!search) return metaTexts;
        return metaTexts.filter(obj => {
            const title = obj.title || '';
            return String(title).toLowerCase().includes(search.toLowerCase());
        });
    }, [metaTexts, search]);

    const metaTextOptions = useMemo(() => metaTexts.map(obj => obj.title), [metaTexts]);

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
