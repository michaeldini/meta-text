import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EntityManagerPage from '../../components/EntityManagerPage';
import FileUploadWidget from '../../components/FileUploadWidget';
import { createSourceDocument, deleteSourceDocument } from '../../services/sourceDocumentService';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';

export default function SourceDocsPage() {
    const { docs: initialDocs = [], loading, error, refresh } = useSourceDocuments();
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

    // Create options for the search bar from document titles
    const docOptions = useMemo(() => initialDocs.map(doc => doc.title), [initialDocs]);

    // Filter documents based on search input
    const filteredDocs = useMemo(() => {
        if (!search) return initialDocs;
        return initialDocs.filter(doc => (doc.title || '').toLowerCase().includes(search.toLowerCase()));
    }, [initialDocs, search]);

    // Handle file upload and title input changes
    const handleFileChange = e => {
        setFile(e.target.files[0]);
        setUploadError('');
        setUploadSuccess('');
    };
    const handleTitleChange = e => setUploadTitle(e.target.value);

    // Handle document upload
    const handleSubmit = async e => {
        e.preventDefault();
        setUploadError('');
        setUploadSuccess('');
        setUploadLoading(true);
        try {
            await createSourceDocument(uploadTitle, file);
            setUploadSuccess('Upload successful!');
            setFile(null);
            setUploadTitle('');
            refresh(); // Refresh the docs list from backend
        } catch (err) {
            // Handle duplicate title error (409)
            if (err.message === 'Title already exists.') {
                setUploadError('A document with this title already exists.');
            } else {
                setUploadError(err.message);
            }
        } finally {
            setUploadLoading(false);
        }
    };

    // Handle document deletion
    const handleDelete = async (docId) => {
        setDeleteLoading(prev => ({ ...prev, [docId]: true }));
        setDeleteError(prev => ({ ...prev, [docId]: null }));
        try {
            if (!docId) throw new Error('No document ID provided for deletion.');
            await deleteSourceDocument(docId);
            refresh(); // Refresh the docs list from backend
        } catch (e) {
            // Handle cannot delete if MetaText exists (400)
            if (e.message.includes('MetaText records exist')) {
                setDeleteError(prev => ({ ...prev, [docId]: 'Cannot delete: MetaText records exist for this document.' }));
            } else {
                setDeleteError(prev => ({ ...prev, [docId]: e.message || 'Error deleting document' }));
            }
        } finally {
            setDeleteLoading(prev => ({ ...prev, [docId]: false }));
        }
    };

    // Use doc.id for navigation
    const handleSourceDocClick = id => navigate(`/sourceDocs/${id}`);

    // Handle delete confirmation dialog
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
        // Pass the full doc object to the click handler
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
