import { useState, useCallback } from 'react';

/**
 * Generic hook for delete-with-confirmation pattern.
 * @param {Function} deleteFn - async function to delete an item by id
 * @param {Function} [onDeleteSuccess] - optional callback after successful delete
 * @returns {Object} handlers and state for delete dialog and per-item loading/error
 */
export default function useDeleteWithConfirmation(deleteFn, onDeleteSuccess) {
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteError, setDeleteError] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const handleDeleteClick = useCallback((id, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setPendingDeleteId(id);
        setConfirmOpen(true);
    }, []);

    const handleConfirmClose = useCallback(() => {
        setConfirmOpen(false);
        setPendingDeleteId(null);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!pendingDeleteId) return;
        setDeleteLoading(prev => ({ ...prev, [pendingDeleteId]: true }));
        setDeleteError(prev => ({ ...prev, [pendingDeleteId]: null }));
        try {
            await deleteFn(pendingDeleteId);
            if (onDeleteSuccess) onDeleteSuccess();
        } catch (e) {
            setDeleteError(prev => ({ ...prev, [pendingDeleteId]: e.message || 'Delete failed' }));
        } finally {
            setDeleteLoading(prev => ({ ...prev, [pendingDeleteId]: false }));
            setConfirmOpen(false);
            setPendingDeleteId(null);
        }
    }, [pendingDeleteId, deleteFn, onDeleteSuccess]);

    return {
        deleteLoading,
        deleteError,
        confirmOpen,
        pendingDeleteId,
        handleDeleteClick,
        handleConfirmClose,
        handleConfirmDelete,
    };
}
