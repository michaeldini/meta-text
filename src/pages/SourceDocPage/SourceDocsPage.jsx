import React, { useState, useMemo } from 'react';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import { uploadSourceDocument, fetchSourceDocument, generateSourceDocInfo, deleteSourceDocument } from '../../services/sourceDocumentService';
import SourceDocUploadForm from '../../components/SourceDocUploadForm';
import { Paper, Typography, CircularProgress, Box, Alert } from '@mui/material';
import ModernList from '../../components/ModernList';
import SourceDocListItem from '../../components/SourceDocListItem';
import SearchBar from '../../components/SearchBar';

export default function SourceDocsPage() {
    const { docs, loading, error } = useSourceDocuments();
    const [search, setSearch] = useState('');
    const [file, setFile] = useState(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState({});
    const [summaryError, setSummaryError] = useState({});
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteError, setDeleteError] = useState({});

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
            await uploadSourceDocument(uploadTitle, file);
            setUploadSuccess('Upload successful!');
            setFile(null);
            setUploadTitle('');
            window.location.reload();
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleDelete = async (docId) => {
        if (!window.confirm('Are you sure you want to delete this document? This cannot be undone.')) return;
        setDeleteLoading(prev => ({ ...prev, [docId]: true }));
        setDeleteError(prev => ({ ...prev, [docId]: null }));
        try {
            await deleteSourceDocument(docId);
            window.location.reload();
        } catch (e) {
            setDeleteError(prev => ({ ...prev, [docId]: e.message || 'Error deleting document' }));
        } finally {
            setDeleteLoading(prev => ({ ...prev, [docId]: false }));
        }
    };

    const handleGenerateSourceDocInfo = async (docId) => {
        setSummaryLoading(prev => ({ ...prev, [docId]: true }));
        setSummaryError(prev => ({ ...prev, [docId]: null }));
        try {
            const doc = await fetchSourceDocument(docId);
            await generateSourceDocInfo(doc.title, doc.text || doc.content || '');
            window.location.reload();
        } catch (e) {
            setSummaryError(prev => ({ ...prev, [docId]: e.message || 'Error generating summary' }));
        } finally {
            setSummaryLoading(prev => ({ ...prev, [docId]: false }));
        }
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Source Documents</Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
                <SourceDocUploadForm
                    file={file}
                    uploadLabel={uploadTitle}
                    uploadError={uploadError}
                    uploadSuccess={uploadSuccess}
                    uploadLoading={uploadLoading}
                    onFileChange={handleFileChange}
                    onLabelChange={handleTitleChange}
                    onSubmit={handleSubmit}
                />
                {uploadError && <Alert severity="error" sx={{ mt: 2 }}>{uploadError}</Alert>}
                {uploadSuccess && <Alert severity="success" sx={{ mt: 2 }}>{uploadSuccess}</Alert>}
            </Paper>
            <SearchBar
                label="Search Documents"
                value={search}
                onChange={setSearch}
                options={docOptions}
                sx={{ mb: 2 }}
            />
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <ModernList
                    items={filteredDocs}
                    emptyMessage="No documents found."
                    renderItem={doc => (
                        <SourceDocListItem
                            key={doc.id}
                            doc={doc}
                            summaryError={summaryError}
                            onGenerateSummary={handleGenerateSourceDocInfo}
                            summaryLoading={summaryLoading}
                            deleteLoading={deleteLoading}
                            deleteError={deleteError}
                            onDelete={handleDelete}
                        />
                    )}
                />
            )}
        </Box>
    );
}
