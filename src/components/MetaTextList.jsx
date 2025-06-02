import React, { useState } from 'react';
import { Paper, List, ListItem, ListItemButton, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Collapse, CircularProgress } from '@mui/material';
import DeleteButton from './DeleteButton';

function MetaTextList({ filteredMetaTexts, selectedMetaText, handleMetaTextClick, handleDeleteMetaText, deleteLoading = {}, deleteError = {} }) {

    // State for confirmation dialog for deletion
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [deletedIds, setDeletedIds] = useState([]);

    const handleClick = (id) => {
        handleMetaTextClick(id);
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
            setDeletedIds(ids => [...ids, pendingDeleteId]); // trigger collapse
            handleDeleteMetaText(pendingDeleteId);
        }
        setConfirmOpen(false);
        setPendingDeleteId(null);
    };

    return (
        <Paper>
            <List>
                {filteredMetaTexts.length === 0 && (
                    <ListItem><ListItemText primary="No meta texts found." /></ListItem>
                )}
                {filteredMetaTexts.map((obj) => {
                    const id = obj.id;
                    const title = obj.title;
                    return (
                        <Collapse in={!deletedIds.includes(id) && deleteLoading[id] !== false} timeout={750} key={id}>
                            <div>
                                <ListItemButton onClick={() => handleClick(id)} selected={selectedMetaText === id}>
                                    <ListItemText primary={title} />
                                    <DeleteButton
                                        onClick={e => handleDeleteClick(id, e)}
                                        disabled={!!deleteLoading[id]}
                                        label="Delete Meta Text"
                                        icon={deleteLoading[id] ? <CircularProgress size={20} /> : undefined}
                                    />
                                </ListItemButton>
                                {deleteError[id] && (
                                    <ListItem>
                                        <ListItemText primary={deleteError[id]} primaryTypographyProps={{ color: 'error', variant: 'body2' }} />
                                    </ListItem>
                                )}
                                <Divider />
                            </div>
                        </Collapse>
                    );
                })}
            </List>
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
        </Paper>
    );
}

export default MetaTextList;
