// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MetaTextPage from '../../src/pages/MetaTextPage/MetaTextPage';
import { useSourceDocuments } from '../../src/hooks/useSourceDocuments';
import { useMetaTexts } from '../../src/hooks/useMetaTexts';

// Mocks
vi.mock('../../src/hooks/useSourceDocuments', () => ({
    useSourceDocuments: vi.fn(),
}));
vi.mock('../../src/hooks/useMetaTexts', () => ({
    useMetaTexts: vi.fn(),
}));
vi.mock('../../src/services/metaTextService', () => ({
    deleteMetaText: vi.fn(),
}));
vi.mock('../../src/components/PageContainer', () => ({
    __esModule: true,
    default: ({ children }) => <div data-testid="PageContainer">{children}</div>,
}));
vi.mock('../../src/components/MetaTextCreateForm', () => ({
    __esModule: true,
    default: () => <div data-testid="MetaTextCreateForm">CreateForm</div>,
}));
vi.mock('../../src/components/SearchableList', () => ({
    __esModule: true,
    default: ({ items, onItemClick, onDeleteClick }) => (
        <div data-testid="SearchableList">
            {items && items.map((item) => (
                <div key={item.id}>
                    <span>{item.title}</span>
                    <button onClick={() => onItemClick(item.id)}>View</button>
                    <button onClick={() => onDeleteClick(item.id)}>Delete</button>
                </div>
            ))}
        </div>
    ),
}));
vi.mock('../../src/utils/logger', () => ({
    __esModule: true,
    default: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
    },
}));
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('MetaTextPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state', () => {
        useSourceDocuments.mockReturnValue({ docs: [], loading: false, error: null });
        useMetaTexts.mockReturnValue({ metaTexts: [], metaTextsLoading: true, metaTextsError: null, refresh: vi.fn() });
        render(<MetaTextPage />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders error state', () => {
        useSourceDocuments.mockReturnValue({ docs: [], loading: false, error: null });
        useMetaTexts.mockReturnValue({ metaTexts: [], metaTextsLoading: false, metaTextsError: 'Failed to load', refresh: vi.fn() });
        render(<MetaTextPage />);
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });

    it('renders list of meta texts', () => {
        useSourceDocuments.mockReturnValue({ docs: [], loading: false, error: null });
        useMetaTexts.mockReturnValue({ metaTexts: [{ id: 1, title: 'Meta 1' }], metaTextsLoading: false, metaTextsError: null, refresh: vi.fn() });
        render(<MetaTextPage />);
        expect(screen.getByText('Meta 1')).toBeInTheDocument();
        expect(screen.getByTestId('SearchableList')).toBeInTheDocument();
    });
});
