import { useState, useCallback } from 'react';

/**
 * Generic hook for delete pattern (no confirmation).
 * @param {Function} deleteFn - async function to delete an item by id
 * @param {Function} [onDeleteSuccess] - optional callback after successful delete
 * @returns {Object} handlers and state for per-item loading/error
 */
export default function useDeleteWithConfirmation(deleteFn, onDeleteSuccess) {
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteError, setDeleteError] = useState({});

    const handleDeleteClick = useCallback(async (id, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setDeleteLoading(prev => ({ ...prev, [id]: true }));
        setDeleteError(prev => ({ ...prev, [id]: null }));
        try {
            await deleteFn(id);
            if (onDeleteSuccess) onDeleteSuccess();
        } catch (e) {
            setDeleteError(prev => ({ ...prev, [id]: e.message || 'Delete failed' }));
        } finally {
            setDeleteLoading(prev => ({ ...prev, [id]: false }));
        }
    }, [deleteFn, onDeleteSuccess]);

    return {
        deleteLoading,
        deleteError,
        handleDeleteClick,
    };
}
