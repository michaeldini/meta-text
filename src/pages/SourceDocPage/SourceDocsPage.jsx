import React, { useState, useMemo } from 'react';
import { useSourceDocumentsWithDetails } from '../../hooks/useSourceDocuments';
import { uploadSourceDocument, fetchSourceDocument, generateAiSummary, deleteSourceDocument } from '../../services/sourceDocumentService';
import SourceDocumentUploadForm from '../../components/SourceDocumentUploadForm';
import { TextField, Paper, Typography, List, ListItem, ListItemText, CircularProgress, Box, Alert } from '@mui/material';
import aiStars from '../../assets/ai-stars.png';
import SourceDocDetails from '../../components/SourceDocDetails';
import SourceDocumentDeleteButton from '../../components/SourceDocumentDeleteButton';

export default function SourceDocsPage() {
    // const navigate = useNavigate();
    const { docs, loading, error } = useSourceDocumentsWithDetails();
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
                <SourceDocumentUploadForm
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
            <TextField
                label="Search Source Documents"
                variant="outlined"
                fullWidth
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            />
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <Paper>
                    <List>
                        {filteredDocs.length === 0 && (
                            <ListItem><ListItemText primary="No documents found." /></ListItem>
                        )}
                        {filteredDocs.map(doc => (
                            <React.Fragment key={doc.title}>
                                <ListItem disablePadding>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <SourceDocDetails
                                            doc={doc}
                                            summaryError={summaryError[doc.title]}
                                            onGenerateSummary={handleGenerateSummary}
                                            summaryLoading={summaryLoading[doc.title]}
                                            aiIcon={<img src={aiStars} alt="AI" style={{ height: 18 }} />}
                                        />
                                        <SourceDocumentDeleteButton
                                            onClick={e => { e.stopPropagation(); handleDelete(doc.title); }}
                                            disabled={deleteLoading[doc.title]}
                                            label="Delete Source Document"
                                        />
                                    </Box>
                                </ListItem>
                                {deleteError[doc.title] && (
                                    <ListItem>
                                        <Alert severity="error">{deleteError[doc.title]}</Alert>
                                    </ListItem>
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}
