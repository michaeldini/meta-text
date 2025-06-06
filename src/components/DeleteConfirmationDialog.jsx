import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

/**
 * Generic confirmation dialog for delete actions.
 * @param {object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {function} props.onClose - Handler to close dialog
 * @param {function} props.onConfirm - Handler to confirm delete
 * @param {string} props.title - Dialog title
 * @param {string} props.text - Dialog content text
 * @param {string} [props.confirmLabel] - Confirm button label
 * @param {string} [props.cancelLabel] - Cancel button label
 */
export default function DeleteConfirmationDialog({ open, onClose, onConfirm, title, text, confirmLabel = 'Delete', cancelLabel = 'Cancel' }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{text}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">{cancelLabel}</Button>
                <Button onClick={onConfirm} color="error" variant="contained" autoFocus>{confirmLabel}</Button>
            </DialogActions>
        </Dialog>
    );
}
