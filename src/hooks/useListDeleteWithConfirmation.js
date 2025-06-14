import { useState, useCallback } from 'react';

/**
 * useListDeleteWithConfirmation - Centralized hook for delete-with-confirmation pattern for lists.
 * @param {Function} deleteFn - async function to delete an item by id
 * @returns {Object} handlers and state for delete dialog and per-item loading/error
 */
export default function useListDeleteWithConfirmation(deleteFn) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [targetId, setTargetId] = useState(null);
    const [loading, setLoading] = useState({});
    const [error, setError] = useState({});

    const handleDeleteClick = useCallback((id, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setTargetId(id);
        setDialogOpen(true);
    }, []);

    const handleDialogClose = useCallback(() => {
        setDialogOpen(false);
        setTargetId(null);
    }, []);

    const handleDialogConfirm = useCallback(async () => {
        if (!targetId) return;
        setLoading(prev => ({ ...prev, [targetId]: true }));
        setError(prev => ({ ...prev, [targetId]: null }));
        try {
            await deleteFn(targetId);
        } catch (e) {
            setError(prev => ({ ...prev, [targetId]: e.message || 'Delete failed' }));
        } finally {
            setLoading(prev => ({ ...prev, [targetId]: false }));
            setDialogOpen(false);
            setTargetId(null);
        }
    }, [targetId, deleteFn]);

    return {
        dialogOpen,
        targetId,
        loading,
        error,
        handleDeleteClick,
        handleDialogClose,
        handleDialogConfirm,
    };
}
