import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useMetaTexts } from '../../src/hooks/useMetaTexts';

vi.mock('../../src/hooks/useMetaTexts', () => ({
    useMetaTexts: vi.fn()
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

import MetaTextPage from '../../src/pages/MetaTextPage/MetaTextPage';

// Reset mocks before each test
beforeEach(() => {
    useMetaTexts.mockImplementation(() => ({
        metaTexts: [{ id: 1, title: 'Test MetaText' }],
        loading: false,
        error: ''
    }));
});

describe('MetaTextPage', () => {
    it('renders meta texts and search bar', () => {
        render(
            <MemoryRouter>
                <MetaTextPage />
            </MemoryRouter>
        );
        expect(screen.getByText('New Meta Text')).toBeInTheDocument();
        expect(screen.getByTestId('search-bar')).toBeInTheDocument();
        expect(screen.getByTestId('generalized-list')).toBeInTheDocument();
        expect(screen.getByText('Test MetaText')).toBeInTheDocument();
    });

    it('handles search input', () => {
        render(
            <MemoryRouter>
                <MetaTextPage />
            </MemoryRouter>
        );
        const searchBar = screen.getByTestId('search-bar');
        searchBar.value = 'Test';
        searchBar.dispatchEvent(new Event('input', { bubbles: true }));
        expect(screen.getByText('Test MetaText')).toBeInTheDocument();
    });

    it('renders message when no meta texts', () => {
        useMetaTexts.mockImplementation(() => ({
            metaTexts: [],
            loading: false,
            error: ''
        }));
        render(
            <MemoryRouter>
                <MetaTextPage />
            </MemoryRouter>
        );
        expect(screen.getByText('No meta texts found.')).toBeInTheDocument();
    });

});
