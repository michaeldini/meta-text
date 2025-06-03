import React from 'react';
import { Box, Typography, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import GeneralCreateForm from '../components/GeneralCreateForm';
import SearchBar from '../components/SearchBar';
import GeneralizedList from '../components/GeneralizedList';

/**
 * Generic entity manager page for list/create/delete/search pattern.
 *
 * Props:
 * - title: string (page title)
 * - createFormProps: props for GeneralCreateForm
 * - searchBarProps: props for SearchBar
 * - list: array of items to display
 * - listLoading: boolean
 * - listError: string
 * - onItemClick: function (id)
 * - onDeleteClick: function (id, e)
 * - deleteLoading: object (id: boolean)
 * - deleteError: object (id: string)
 * - emptyMessage: string
 * - confirmDialog: { open, onClose, onConfirm, title, content }
 */
export default function EntityManagerPage({
    title,
    createFormProps,
    searchBarProps,
    list,
    listLoading,
    listError,
    onItemClick,
    onDeleteClick,
    deleteLoading,
    deleteError,
    emptyMessage,
    confirmDialog
}) {
    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>{title}</Typography>
            <GeneralCreateForm {...createFormProps} />
            <SearchBar {...searchBarProps} sx={{ mb: 2, ...searchBarProps.sx }} />
            {listLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : listError ? (
                <Alert severity="error">{listError}</Alert>
            ) : (
                <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, mb: 2 }}>
                    <nav aria-label={`${title} list`}>
                        <GeneralizedList
                            items={list}
                            onItemClick={onItemClick}
                            onDeleteClick={onDeleteClick}
                            deleteLoading={deleteLoading}
                            deleteError={deleteError}
                            emptyMessage={emptyMessage}
                        />
                    </nav>
                </Box>
            )}
            <Dialog open={confirmDialog.open} onClose={confirmDialog.onClose}>
                <DialogTitle>{confirmDialog.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{confirmDialog.content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmDialog.onClose} color="primary">Cancel</Button>
                    <Button onClick={confirmDialog.onConfirm} color="error" variant="contained" autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
