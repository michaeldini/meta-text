/**
 * Test file for the editable SourceDoc component
 * This demonstrates the new editing functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi } from 'vitest';

import SourceDoc from '../src/pages/SourceDocument/components/SourceDoc';
import type { SourceDocumentDetail } from '../src/types';

// Mock the services
vi.mock('../src/services/sourceDocumentService', () => ({
    updateSourceDocument: vi.fn()
}));

// Mock the store
vi.mock('../src/store', () => ({
    useUIPreferencesStore: vi.fn(() => ({
        textSizePx: 16,
        fontFamily: 'Arial',
        lineHeight: 1.5
    }))
}));

// Mock the logger
vi.mock('../src/utils', () => ({
    log: {
        info: vi.fn(),
        error: vi.fn()
    }
}));

const theme = createTheme();

const mockDoc: SourceDocumentDetail = {
    id: 1,
    title: 'Test Document',
    text: 'This is a test document with some content that can be edited.',
    author: 'Test Author',
    summary: 'Test summary',
    characters: null,
    locations: null,
    themes: null,
    symbols: null
};

const renderWithTheme = (component: React.ReactElement) => {
    return render(
        <ThemeProvider theme={theme}>
            {component}
        </ThemeProvider>
    );
};

describe('SourceDoc Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders document text in view mode', () => {
        renderWithTheme(<SourceDoc doc={mockDoc} />);

        expect(screen.getByText(mockDoc.text)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /edit document text/i })).toBeInTheDocument();
    });

    test('enters edit mode when edit button is clicked', async () => {
        renderWithTheme(<SourceDoc doc={mockDoc} />);

        const editButton = screen.getByRole('button', { name: /edit document text/i });
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(screen.getByRole('textbox')).toBeInTheDocument();
            expect(screen.getByDisplayValue(mockDoc.text)).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel editing/i })).toBeInTheDocument();
    });

    test('cancels editing and returns to view mode', async () => {
        renderWithTheme(<SourceDoc doc={mockDoc} />);

        // Enter edit mode
        fireEvent.click(screen.getByRole('button', { name: /edit document text/i }));

        await waitFor(() => {
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        // Cancel editing
        const cancelButton = screen.getByRole('button', { name: /cancel editing/i });
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
            expect(screen.getByText(mockDoc.text)).toBeInTheDocument();
        });
    });

    test('allows text editing in textarea', async () => {
        renderWithTheme(<SourceDoc doc={mockDoc} />);

        // Enter edit mode
        fireEvent.click(screen.getByRole('button', { name: /edit document text/i }));

        await waitFor(() => {
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        const textarea = screen.getByRole('textbox');
        const newText = 'This is updated text content';

        fireEvent.change(textarea, { target: { value: newText } });

        expect(textarea).toHaveValue(newText);
    });

    test('handles empty document text', () => {
        const emptyDoc = { ...mockDoc, text: '' };
        renderWithTheme(<SourceDoc doc={emptyDoc} />);

        expect(screen.getByText('No content available')).toBeInTheDocument();
    });
});

export { };
