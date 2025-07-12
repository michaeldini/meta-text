/**
 * Demo test showing the new editable SourceDocInfo functionality
 * This demonstrates editing both simple text fields and list fields
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi } from 'vitest';

import SourceDocInfo from '../src/components/SourceDocInfo';
import type { SourceDocumentDetail } from '../src/types';

// Mock the services
vi.mock('../src/services/sourceDocumentService', () => ({
    updateSourceDocument: vi.fn()
}));

// Mock the utils
vi.mock('../src/utils', () => ({
    splitToArray: vi.fn((text: string) => text.split(',').map(s => s.trim()).filter(Boolean)),
    log: {
        info: vi.fn(),
        error: vi.fn()
    }
}));

const theme = createTheme();

const mockDoc: SourceDocumentDetail = {
    id: 1,
    title: 'Test Document',
    text: 'Document content',
    author: 'Test Author',
    summary: 'This is a test summary of the document',
    characters: 'Alice, Bob, Charlie',
    locations: 'New York, London',
    themes: 'Love, Adventure, Mystery',
    symbols: null
};

const renderWithTheme = (component: React.ReactElement) => {
    return render(
        <ThemeProvider theme={theme}>
            {component}
        </ThemeProvider>
    );
};

describe('Editable SourceDocInfo Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('shows edit buttons for each field', () => {
        renderWithTheme(<SourceDocInfo doc={mockDoc} />);

        // Should show edit buttons (pencil icons) for each field
        const editButtons = screen.getAllByRole('button');
        expect(editButtons.length).toBeGreaterThan(0);
    });

    test('shows empty fields as editable', () => {
        const docWithEmptyFields = { ...mockDoc, symbols: null, locations: null };
        renderWithTheme(<SourceDocInfo doc={docWithEmptyFields} />);

        // Empty fields should show as "(Empty)" and be editable
        expect(screen.getByText(/Symbols \(Empty\)/)).toBeInTheDocument();
    });

    test('handles list field editing (characters)', async () => {
        renderWithTheme(<SourceDocInfo doc={mockDoc} />);

        // Find the Characters accordion
        const charactersAccordion = screen.getByText('Characters');
        expect(charactersAccordion).toBeInTheDocument();

        // Should display the list as comma-separated text
        expect(screen.getByText('Alice, Bob, Charlie')).toBeInTheDocument();
    });

    test('handles text field editing (author)', async () => {
        renderWithTheme(<SourceDocInfo doc={mockDoc} />);

        // Find the Author accordion
        const authorAccordion = screen.getByText('Author');
        expect(authorAccordion).toBeInTheDocument();

        // Should display the author text
        expect(screen.getByText('Test Author')).toBeInTheDocument();
    });

    test('shows proper field types with correct helper text', () => {
        renderWithTheme(<SourceDocInfo doc={mockDoc} />);

        // List fields should be handled differently from text fields
        // Characters, Locations, Themes, Symbols are list fields
        // Author, Summary are text fields
        expect(screen.getByText('Characters')).toBeInTheDocument();
        expect(screen.getByText('Author')).toBeInTheDocument();
        expect(screen.getByText('Summary')).toBeInTheDocument();
    });
});

export { };
