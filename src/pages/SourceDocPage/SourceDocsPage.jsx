import React, { useState, useMemo } from 'react';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import { uploadSourceDocument, fetchSourceDocument, generateAiSummary, deleteSourceDocument } from '../../services/sourceDocumentService';
import SourceDocUploadForm from '../../components/SourceDocUploadForm';
import { TextField, Paper, Typography, CircularProgress, Box, Alert, Slide } from '@mui/material';
import SourceDocList from '../../components/SourceDocList';
import SearchBar from '../../components/SearchBar';
export default function SourceDocsPage() {
    // const navigate = useNavigate();
    const { docs, loading, error } = useSourceDocuments();
    const [search, setSearch] = useState('');
    const [file, setFile] = useState(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState({}); // { [title]: boolean }
    const [summaryError, setSummaryError] = useState({}); // { [title]: string|null }
    const [deleteLoading, setDeleteLoading] = useState({}); // { [title]: boolean }
    const [deleteError, setDeleteError] = useState({}); // { [title]: string|null }

    // Filtered docs by search
    const filteredDocs = useMemo(() => {
        if (!search) return docs;
        return docs.filter(doc => doc.title.toLowerCase().includes(search.toLowerCase()));
    }, [docs, search]);

    // Extract options for Autocomplete
    const docOptions = useMemo(() => docs.map(doc => doc.title), [docs]);

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
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setUploadLoading(false);
        }
    };
    // const handleDocClick = title => navigate(`/sourceDocs/${encodeURIComponent(title)}`);

    // Generate summary handler for a doc
    const handleGenerateSummary = async (title) => {
        setSummaryLoading(prev => ({ ...prev, [title]: true }));
        setSummaryError(prev => ({ ...prev, [title]: null }));
        try {
            const doc = await fetchSourceDocument(title);
            await generateAiSummary(title, doc.text || doc.content || '');
            // Optionally, refetch docs or update UI to show new summary
            // For now, just reload the page data
            window.location.reload();
        } catch (e) {
            setSummaryError(prev => ({ ...prev, [title]: e.message || 'Error generating summary' }));
        } finally {
            setSummaryLoading(prev => ({ ...prev, [title]: false }));
        }
    };

    const handleDelete = async (title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
        setDeleteLoading(prev => ({ ...prev, [title]: true }));
        setDeleteError(prev => ({ ...prev, [title]: null }));
        try {
            await deleteSourceDocument(title);
            // Optionally, refetch docs or update UI to show new summary
            window.location.reload();
        } catch (e) {
            setDeleteError(prev => ({ ...prev, [title]: e.message || 'Error deleting document' }));
        } finally {
            setDeleteLoading(prev => ({ ...prev, [title]: false }));
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
                <SourceDocList
                    docs={filteredDocs}
                    summaryError={summaryError}
                    onGenerateSummary={handleGenerateSummary}
                    summaryLoading={summaryLoading}
                    deleteLoading={deleteLoading}
                    deleteError={deleteError}
                    onDelete={handleDelete}
                />
            )}
        </Box>
    );
}
