import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock the useSourceDocuments hook before importing the component
vi.mock('../../src/hooks/useSourceDocuments', () => ({
    useSourceDocuments: vi.fn()
}));
import { useSourceDocuments } from '../../src/hooks/useSourceDocuments';

vi.mock('../../src/hooks/useDeleteWithConfirmation', () => ({
    default: () => ({
        deleteLoading: false,
        deleteError: '',
        confirmOpen: false,
        handleDeleteClick: vi.fn(),
        handleConfirmClose: vi.fn(),
        handleConfirmDelete: vi.fn(),
    })
}));

import SourceDocsPage from '../../src/pages/SourceDocPage/SourceDocsPage';

beforeEach(() => {
    useSourceDocuments.mockImplementation(() => ({
        docs: [{ id: 1, title: 'Doc 1' }],
        loading: false,
        error: ''
    }));
});

describe('SourceDocsPage', () => {
    it('renders the source docs page components correctly', () => {
        render(
            <MemoryRouter>
                <SourceDocsPage />
            </MemoryRouter>
        );
        expect(screen.getByTestId('upload-title')).toBeInTheDocument();
        expect(screen.getByTestId('generalized-list')).toBeInTheDocument();
        expect(screen.getByTestId('search-bar')).toBeInTheDocument();
        expect(screen.getByText('Doc 1')).toBeInTheDocument();
    });

    it('handles search input', () => {
        render(
            <MemoryRouter>
                <SourceDocsPage />
            </MemoryRouter>
        );
        const searchBar = screen.getByTestId('search-bar');
        searchBar.value = 'Test';
        searchBar.dispatchEvent(new Event('input', { bubbles: true }));
        expect(screen.getByText('Doc 1')).toBeInTheDocument();
    });

    it('shows message when no source docs are available', () => {
        useSourceDocuments.mockImplementation(() => ({
            docs: [],
            loading: false,
            error: ''
        }));
        render(
            <MemoryRouter>
                <SourceDocsPage />
            </MemoryRouter>
        );
        expect(screen.getByText('No documents found.')).toBeInTheDocument();
    });

    it('renders error message when error occurs', () => {
        useSourceDocuments.mockImplementation(() => ({
            docs: [],
            loading: false,
            error: 'Something went wrong'
        }));
        render(
            <MemoryRouter>
                <SourceDocsPage />
            </MemoryRouter>
        );
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
});
