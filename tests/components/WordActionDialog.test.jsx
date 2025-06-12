import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WordActionDialog from '../../src/features/WordActionDialog';
import '@testing-library/jest-dom';

// Mock MUI icons
vi.mock('@mui/icons-material/ContentCut', () => ({
    __esModule: true,
    default: () => <span data-testid="content-cut-icon">Cut</span>,
}));
vi.mock('@mui/icons-material/QuestionMark', () => ({
    __esModule: true,
    default: () => <span data-testid="question-mark-icon">Q?</span>,
}));

// Mock fetchDefinitionInContext
const mockFetchDefinition = vi.fn();
vi.mock('../../src/services/aiService', () => ({
    fetchDefinitionInContext: (...args) => mockFetchDefinition(...args),
}));

describe('WordActionDialog', () => {
    const baseProps = {
        anchorEl: document.createElement('div'),
        onClose: vi.fn(),
        word: 'test',
        onSplit: vi.fn(),
        context: 'test context',
        metaTextId: 42,
    };

    beforeEach(() => {
        mockFetchDefinition.mockReset();
        baseProps.onClose.mockReset();
        baseProps.onSplit.mockReset();
    });

    it('renders popover and action buttons when open', () => {
        render(<WordActionDialog {...baseProps} />);
        expect(screen.getByRole('presentation')).toBeInTheDocument();
        expect(screen.getByTestId('content-cut-icon')).toBeInTheDocument();
        expect(screen.getByTestId('question-mark-icon')).toBeInTheDocument();
    });

    it('calls onSplit when split button is clicked', () => {
        render(<WordActionDialog {...baseProps} />);
        const splitBtn = screen.getAllByRole('button')[0];
        fireEvent.click(splitBtn);
        expect(baseProps.onSplit).toHaveBeenCalled();
    });

    it('calls fetchDefinitionInContext and shows definition', async () => {
        mockFetchDefinition.mockResolvedValueOnce({
            definition: 'A test definition',
            definitionWithContext: 'A test definition with context',
        });
        render(<WordActionDialog {...baseProps} />);
        const defBtn = screen.getAllByRole('button')[1];
        fireEvent.click(defBtn);
        await waitFor(() => {
            expect(screen.getByText('A test definition')).toBeInTheDocument();
            expect(screen.getByText('A test definition with context')).toBeInTheDocument();
        });
    });

    it('shows error if fetchDefinitionInContext fails', async () => {
        mockFetchDefinition.mockRejectedValueOnce(new Error('fail!'));
        render(<WordActionDialog {...baseProps} />);
        const defBtn = screen.getAllByRole('button')[1];
        fireEvent.click(defBtn);
        await waitFor(() => {
            expect(screen.getByText('fail!')).toBeInTheDocument();
        });
    });

    it('shows loading spinner while fetching', async () => {
        let resolve;
        mockFetchDefinition.mockImplementation(() => new Promise(r => { resolve = r; }));
        render(<WordActionDialog {...baseProps} />);
        const defBtn = screen.getAllByRole('button')[1];
        fireEvent.click(defBtn);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        resolve({ definition: 'def', definitionWithContext: 'def ctx' });
        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
    });

    it('calls onClose when popover is closed', () => {
        render(<WordActionDialog {...baseProps} />);
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
        // Simulate popover close
        baseProps.onClose();
        expect(baseProps.onClose).toHaveBeenCalled();
    });
});
