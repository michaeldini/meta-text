import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EntityManagerPage from '../../components/EntityManagerPage';
import FileUploadWidget from '../../components/FileUploadWidget';
import { uploadSourceDocument, deleteSourceDocument } from '../../services/sourceDocumentService';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';

export default function SourceDocsPage() {
    const { docs: initialDocs, loading, error } = useSourceDocuments();
    const [docs, setDocs] = useState(initialDocs);
    const [search, setSearch] = useState('');
    const [file, setFile] = useState(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteError, setDeleteError] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const navigate = useNavigate();

    // Keep docs in sync with hook if it changes (e.g. on mount)
    React.useEffect(() => {
        setDocs(initialDocs);
    }, [initialDocs]);

    const docOptions = useMemo(() => docs.map(doc => doc.title), [docs]);
    const filteredDocs = useMemo(() => {
        if (!search) return docs;
        return docs.filter(doc => (doc.title || '').toLowerCase().includes(search.toLowerCase()));
    }, [docs, search]);

    const handleFileChange = e => {
        setFile(e.target.files[0]);
        setUploadError('');
        setUploadSuccess('');
    };
    const handleTitleChange = e => setUploadTitle(e.target.value);
    const handleSubmit = async e => {
        e.preventDefault();
        setUploadError('');
        setUploadSuccess('');
        setUploadLoading(true);
        try {
            const newDoc = await uploadSourceDocument(uploadTitle, file);
            setUploadSuccess('Upload successful!');
            setFile(null);
            setUploadTitle('');
            setDocs(prev => [...prev, newDoc]);
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleDelete = async (docId) => {
        setDeleteLoading(prev => ({ ...prev, [docId]: true }));
        setDeleteError(prev => ({ ...prev, [docId]: null }));
        try {
            if (!docId) throw new Error('No document ID provided for deletion.');
            await deleteSourceDocument(docId);
            setDocs(prev => prev.filter(doc => doc.id !== docId));
        } catch (e) {
            setDeleteError(prev => ({ ...prev, [docId]: e.message || 'Error deleting document' }));
        } finally {
            setDeleteLoading(prev => ({ ...prev, [docId]: false }));
        }
    };

    const handleSourceDocClick = id => navigate(`/sourceDocs/${encodeURIComponent(id)}`);

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
        <EntityManagerPage
            title="Source Documents"
            createFormProps={{
                titleLabel: 'New Source Document',
                widget: (
                    <FileUploadWidget file={file} onFileChange={handleFileChange} />
                ),
                textLabel: 'Title',
                textValue: uploadTitle,
                onTextChange: handleTitleChange,
                buttonLabel: 'Upload',
                buttonLoadingLabel: 'Uploading...',
                loading: uploadLoading,
                onSubmit: handleSubmit,
                error: uploadError,
                success: uploadSuccess,
                buttonProps: { color: 'primary' }
            }}
            searchBarProps={{
                label: 'Search Documents',
                value: search,
                onChange: setSearch,
                options: docOptions
            }}
            list={filteredDocs}
            listLoading={loading}
            listError={error}
            onItemClick={handleSourceDocClick}
            onDeleteClick={handleDeleteClick}
            deleteLoading={deleteLoading}
            deleteError={deleteError}
            emptyMessage="No documents found."
            confirmDialog={{
                open: confirmOpen,
                onClose: handleConfirmClose,
                onConfirm: handleConfirmDelete,
                title: 'Delete Source Document?',
                content: 'Are you sure you want to delete this source document? This action cannot be undone.'
            }}
        />
    );
}
