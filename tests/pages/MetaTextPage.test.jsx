import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MetaTextPage from '../../src/pages/MetaTextPage/MetaTextPage';

vi.mock('../../src/hooks/useMetaTexts', () => ({
    useMetaTexts: () => ({ data: [{ id: 1, title: 'Test MetaText' }], loading: false, error: '' })
}));
vi.mock('../../src/hooks/useSourceDocuments', () => ({
    useSourceDocuments: () => ({ docs: [{ id: 1, title: 'Doc 1' }], loading: false, error: '' })
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
vi.mock('../../src/pages/MetaTextPage/MetaTextCreateForm', () => ({ default: () => <div data-testid="create-form" /> }));
vi.mock('../../src/components/SearchBar', () => ({ default: ({ onChange }) => <input data-testid="search-bar" onChange={e => onChange(e.target.value)} /> }));
vi.mock('../../src/components/DeleteConfirmationDialog', () => ({ default: () => null }));
vi.mock('../../src/utils/logger', () => ({ default: { info: vi.fn(), error: vi.fn() }, info: vi.fn(), error: vi.fn() }));


describe('MetaTextPage', () => {
    it('renders meta texts and search bar', () => {
        render(
            <MemoryRouter>
                <MetaTextPage />
            </MemoryRouter>
        );
        expect(screen.getByTestId('generalized-list')).toBeInTheDocument();
        expect(screen.getByTestId('search-bar')).toBeInTheDocument();
        expect(screen.getByTestId('create-form')).toBeInTheDocument();
        expect(screen.getByText('Test MetaText')).toBeInTheDocument();
    });
});
