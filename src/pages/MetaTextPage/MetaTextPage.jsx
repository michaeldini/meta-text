import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, Alert, ListItem, ListItemButton, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Collapse, List } from '@mui/material';
import MetaTextCreateForm from '../../components/MetaTextCreateForm';
import SearchBar from '../../components/SearchBar';
import DeleteButton from '../../components/DeleteButton';
import { useMetaTexts } from '../../hooks/useMetaTexts';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';

export default function MetaTextPage() {
    const [createSuccess, setCreateSuccess] = useState('');
    const { docs: sourceDocs, loading: sourceDocsLoading, error: sourceDocsError } = useSourceDocuments();
    const { metaTexts, metaTextsLoading, metaTextsError } = useMetaTexts([createSuccess]);
    const [search, setSearch] = useState('');
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteError, setDeleteError] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
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

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Meta Texts</Typography>
            <MetaTextCreateForm
                sourceDocs={sourceDocs}
                sourceDocsLoading={sourceDocsLoading}
                sourceDocsError={sourceDocsError}
                setCreateSuccess={setCreateSuccess}
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
                    <nav aria-label="Meta Texts list">
                        <List>
                            {filteredMetaTexts.length === 0 ? (
                                <ListItem>
                                    <ListItemText primary="No meta texts found." />
                                </ListItem>
                            ) : (
                                filteredMetaTexts.map(obj => {
                                    const id = obj.id;
                                    const title = obj.title;
                                    return (
                                        <React.Fragment key={id}>
                                            <ListItem disablePadding alignItems="flex-start">
                                                <ListItemButton onClick={() => handleMetaTextClick(id)}>
                                                    <ListItemText primary={title} />
                                                    <DeleteButton
                                                        onClick={e => handleDeleteClick(id, e)}
                                                        disabled={!!deleteLoading[id]}
                                                        label="Delete Meta Text"
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                            {deleteError[id] && (
                                                <ListItem>
                                                    <ListItemText
                                                        primary={deleteError[id]}
                                                        slotProps={{ primary: { color: 'error', variant: 'body2' } }}
                                                    />
                                                </ListItem>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </List>
                    </nav>
                </Box>
            )}
            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Delete Meta Text?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this meta text? This action cannot be undone.
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
