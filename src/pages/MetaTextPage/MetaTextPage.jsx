import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SourceDocSelect from '../../components/SourceDocSelect';
import { useMetaTexts } from '../../hooks/useMetaTexts';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import EntityManagerPage from '../../components/EntityManagerPage';

export default function MetaTextPage() {
    const [createSuccess, setCreateSuccess] = useState('');
    const { docs: sourceDocs, loading: sourceDocsLoading, error: sourceDocsError } = useSourceDocuments();
    const { metaTexts, metaTextsLoading, metaTextsError } = useMetaTexts([createSuccess]);
    const [search, setSearch] = useState('');
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteError, setDeleteError] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [selectedSourceDocId, setSelectedSourceDocId] = useState('');
    const [metaTextTitle, setMetaTextTitle] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');
    const [createSuccessMsg, setCreateSuccessMsg] = useState('');
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

    const handleCreateMetaText = async (e) => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccessMsg('');
        setCreateLoading(true);
        try {
            const { createMetaText } = await import('../../services/metaTextService');
            await createMetaText(selectedSourceDocId, metaTextTitle);
            setCreateSuccess(Date.now());
            setSelectedSourceDocId('');
            setMetaTextTitle('');
            setCreateSuccessMsg('Meta-text created!');
        } catch (err) {
            let errorMsg = 'Failed to create meta text';
            if (err) {
                if (typeof err === 'string') {
                    errorMsg = err;
                } else if (err.message) {
                    errorMsg = err.message;
                } else if (err.response && err.response.data && err.response.data.detail) {
                    errorMsg = err.response.data.detail;
                } else if (err.response && err.response.data) {
                    errorMsg = JSON.stringify(err.response.data);
                } else {
                    errorMsg = JSON.stringify(err);
                }
            }
            setCreateError(errorMsg);
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <EntityManagerPage
            title="Meta Texts"
            createFormProps={{
                titleLabel: 'New Meta Text',
                widget: (
                    <SourceDocSelect
                        value={selectedSourceDocId}
                        onChange={e => setSelectedSourceDocId(e.target.value)}
                        sourceDocs={sourceDocs}
                        loading={sourceDocsLoading}
                        error={sourceDocsError}
                        required
                    />
                ),
                textLabel: 'Meta-text Name',
                textValue: metaTextTitle,
                onTextChange: e => setMetaTextTitle(e.target.value),
                buttonLabel: 'Create',
                buttonLoadingLabel: 'Creating...',
                loading: createLoading,
                onSubmit: handleCreateMetaText,
                error: createError,
                success: createSuccessMsg,
                buttonProps: { sx: { minWidth: 120 } }
            }}
            searchBarProps={{
                label: 'Search Meta Texts',
                value: search,
                onChange: setSearch,
                options: metaTextOptions
            }}
            list={filteredMetaTexts}
            listLoading={metaTextsLoading}
            listError={metaTextsError}
            onItemClick={handleMetaTextClick}
            onDeleteClick={handleDeleteClick}
            deleteLoading={deleteLoading}
            deleteError={deleteError}
            emptyMessage="No meta texts found."
            confirmDialog={{
                open: confirmOpen,
                onClose: handleConfirmClose,
                onConfirm: handleConfirmDelete,
                title: 'Delete Meta Text?',
                content: 'Are you sure you want to delete this meta text? This action cannot be undone.'
            }}
        />
    );
}
