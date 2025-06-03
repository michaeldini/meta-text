import React, { useState, useMemo } from 'react';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import { uploadSourceDocument, fetchSourceDocument, generateSourceDocInfo, deleteSourceDocument } from '../../services/sourceDocumentService';
import GeneralCreateForm from '../../components/GeneralCreateForm';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Paper, Typography, CircularProgress, Box, Alert, List, ListItem, ListItemText, ListItemButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import SourceDocListItem from '../../components/SourceDocListItem';
import SearchBar from '../../components/SearchBar';
import DeleteButton from '../../components/DeleteButton';

export default function SourceDocsPage() {
    const { docs, loading, error } = useSourceDocuments();
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
        setDeleteLoading(prev => ({ ...prev, [docId]: true }));
        setDeleteError(prev => ({ ...prev, [docId]: null }));
        try {
            // Pass the correct argument: docId (should be the document's id, not undefined/null)
            if (!docId) throw new Error('No document ID provided for deletion.');
            await deleteSourceDocument(docId);
            window.location.reload();
        } catch (e) {
            setDeleteError(prev => ({ ...prev, [docId]: e.message || 'Error deleting document' }));
        } finally {
            setDeleteLoading(prev => ({ ...prev, [docId]: false }));
        }
    };


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
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Source Documents</Typography>
            <GeneralCreateForm
                titleLabel="New Source Document"
                widget={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".txt"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-upload">
                            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                                {file ? 'Change File' : 'Upload File'}
                            </Button>
                        </label>
                        {file && <span className="file-name">{file.name}</span>}
                    </Box>
                }
                textLabel="Title"
                textValue={uploadTitle}
                onTextChange={handleTitleChange}
                buttonLabel="Upload"
                buttonLoadingLabel="Uploading..."
                loading={uploadLoading}
                onSubmit={handleSubmit}
                error={uploadError}
                success={uploadSuccess}
                buttonProps={{ color: 'primary' }}
            />
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
                <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, mb: 2 }}>
                    <nav aria-label="Source Documents list">
                        <List>
                            {filteredDocs.length === 0 ? (
                                <ListItem>
                                    <ListItemText primary="No documents found." />
                                </ListItem>
                            ) : (
                                filteredDocs.map(doc => (
                                    <React.Fragment key={doc.id}>
                                        <ListItem disablePadding alignItems="flex-start">
                                            <ListItemButton onClick={() => window.location.href = `/sourceDocs/${encodeURIComponent(doc.id)}`}>
                                                <ListItemText primary={doc.title} />
                                                <DeleteButton
                                                    onClick={e => handleDeleteClick(doc.id, e)}
                                                    disabled={deleteLoading[doc.id]}
                                                    label="Delete Source Document"
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                        {deleteError[doc.id] && (
                                            <ListItem>
                                                <ListItemText
                                                    primary={deleteError[doc.id]}
                                                    slotProps={{ primary: { color: 'error', variant: 'body2' } }}
                                                />
                                            </ListItem>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </List>
                    </nav>
                </Box>
            )}
            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Delete Source Document?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this source document? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
