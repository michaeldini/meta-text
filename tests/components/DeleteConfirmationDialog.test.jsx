// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DeleteConfirmationDialog from '../../src/components/DeleteConfirmationDialog';

// Mock MUI Dialog and subcomponents for isolation (optional, but can help if MUI internals cause issues)
// If you want to test the real MUI Dialog, you can remove these mocks.
// vi.mock('@mui/material', () => ({
//   Dialog: ({ open, children }) => open ? <div data-testid="dialog">{children}</div> : null,
//   DialogTitle: ({ children }) => <div data-testid="dialog-title">{children}</div>,
//   DialogContent: ({ children }) => <div data-testid="dialog-content">{children}</div>,
//   DialogContentText: ({ children }) => <div data-testid="dialog-content-text">{children}</div>,
//   DialogActions: ({ children }) => <div data-testid="dialog-actions">{children}</div>,
//   Button: ({ onClick, children }) => <button onClick={onClick}>{children}</button>,
// }));

describe('DeleteConfirmationDialog', () => {
    let onClose, onConfirm;
    beforeEach(() => {
        onClose = vi.fn();
        onConfirm = vi.fn();
    });

    it('renders dialog with title and text when open', () => {
        render(
            <DeleteConfirmationDialog
                open={true}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item?"
                text="Are you sure?"
            />
        );
        expect(screen.getByText('Delete Item?')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('does not render dialog when open is false', () => {
        render(
            <DeleteConfirmationDialog
                open={false}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item?"
                text="Are you sure?"
            />
        );
        // Dialog content should not be in the document
        expect(screen.queryByText('Delete Item?')).toBeNull();
        expect(screen.queryByText('Are you sure?')).toBeNull();
    });

    it('calls onClose when Cancel is clicked', () => {
        render(
            <DeleteConfirmationDialog
                open={true}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item?"
                text="Are you sure?"
            />
        );
        fireEvent.click(screen.getByText('Cancel'));
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onConfirm when Delete is clicked', () => {
        render(
            <DeleteConfirmationDialog
                open={true}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item?"
                text="Are you sure?"
            />
        );
        fireEvent.click(screen.getByText('Delete'));
        expect(onConfirm).toHaveBeenCalled();
    });

    it('renders custom button labels', () => {
        render(
            <DeleteConfirmationDialog
                open={true}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item?"
                text="Are you sure?"
                confirmLabel="Yes, Delete"
                cancelLabel="No, Cancel"
            />
        );
        expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
        expect(screen.getByText('No, Cancel')).toBeInTheDocument();
    });
});
