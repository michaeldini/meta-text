import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SourceDocsPage from '../../src/pages/SourceDocPage/SourceDocsPage';

vi.mock('../../src/hooks/useSourceDocuments', () => ({
    useSourceDocuments: () => ({ docs: [{ id: 1, title: 'Doc 1' }], loading: false, error: '', refresh: vi.fn() })
}));
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
vi.mock('../../src/hooks/useFilteredList', () => ({
    useFilteredList: (items) => items
}));
vi.mock('../../src/components/GeneralizedList', () => ({ default: ({ items }) => <div data-testid="generalized-list">{items.map(i => i.title)}</div> }));
vi.mock('../../src/components/EntityManagerPage', () => ({ default: ({ children }) => <div>{children}</div> }));
vi.mock('../../src/pages/SourceDocPage/SourceDocUploadForm', () => ({ default: () => <div data-testid="upload-form" /> }));
vi.mock('../../src/components/SearchBar', () => ({ default: ({ onChange }) => <input data-testid="search-bar" onChange={e => onChange(e.target.value)} /> }));
vi.mock('../../src/components/DeleteConfirmationDialog', () => ({ default: () => null }));


describe('SourceDocsPage', () => {
    it('renders the source docs page components correctly', () => {
        render(
            <MemoryRouter>
                <SourceDocsPage />
            </MemoryRouter>
        );
        expect(screen.getByTestId('generalized-list')).toBeInTheDocument();
        expect(screen.getByTestId('search-bar')).toBeInTheDocument();
        expect(screen.getByTestId('upload-form')).toBeInTheDocument();
        expect(screen.getByText('Doc 1')).toBeInTheDocument();
    });
});
