import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useListDeleteWithConfirmation from '../../src/hooks/useListDeleteWithConfirmation';

describe('useListDeleteWithConfirmation', () => {
    let deleteFn;
    beforeEach(() => {
        deleteFn = vi.fn();
    });

    it('initial state is correct', () => {
        const { result } = renderHook(() => useListDeleteWithConfirmation(deleteFn));
        expect(result.current.dialogOpen).toBe(false);
        expect(result.current.targetId).toBe(null);
        expect(result.current.loading).toEqual({});
        expect(result.current.error).toEqual({});
    });

    it('opens dialog and sets targetId on handleDeleteClick', () => {
        const { result } = renderHook(() => useListDeleteWithConfirmation(deleteFn));
        act(() => {
            result.current.handleDeleteClick(42);
        });
        expect(result.current.dialogOpen).toBe(true);
        expect(result.current.targetId).toBe(42);
    });

    it('closes dialog and clears targetId on handleDialogClose', () => {
        const { result } = renderHook(() => useListDeleteWithConfirmation(deleteFn));
        act(() => {
            result.current.handleDeleteClick(42);
            result.current.handleDialogClose();
        });
        expect(result.current.dialogOpen).toBe(false);
        expect(result.current.targetId).toBe(null);
    });

    it('calls deleteFn and handles success', async () => {
        deleteFn.mockResolvedValueOnce();
        const { result } = renderHook(() => useListDeleteWithConfirmation(deleteFn));
        act(() => {
            result.current.handleDeleteClick(1);
        });
        await act(async () => {
            await result.current.handleDialogConfirm();
        });
        expect(deleteFn).toHaveBeenCalledWith(1);
        expect(result.current.loading[1]).toBe(false);
        expect(result.current.error[1]).toBe(null);
        expect(result.current.dialogOpen).toBe(false);
        expect(result.current.targetId).toBe(null);
    });

    it('handles delete error', async () => {
        deleteFn.mockRejectedValueOnce(new Error('Delete failed'));
        const { result } = renderHook(() => useListDeleteWithConfirmation(deleteFn));
        act(() => {
            result.current.handleDeleteClick(2);
        });
        await act(async () => {
            await result.current.handleDialogConfirm();
        });
        expect(deleteFn).toHaveBeenCalledWith(2);
        expect(result.current.loading[2]).toBe(false);
        expect(result.current.error[2]).toBe('Delete failed');
        expect(result.current.dialogOpen).toBe(false);
        expect(result.current.targetId).toBe(null);
    });
});
