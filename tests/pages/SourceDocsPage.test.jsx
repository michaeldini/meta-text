// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SourceDocsPage from '../../src/pages/SourceDocPage/SourceDocsPage';
import { useSourceDocuments } from '../../src/hooks/useSourceDocuments';

// Mocks
vi.mock('../../src/hooks/useSourceDocuments', () => ({
    useSourceDocuments: vi.fn(),
}));
vi.mock('../../src/services/sourceDocumentService', () => ({
    deleteSourceDocument: vi.fn(),
}));
vi.mock('../../src/components/PageContainer', () => ({
    __esModule: true,
    default: ({ children }) => <div data-testid="PageContainer">{children}</div>,
}));
vi.mock('../../src/components/SourceDocUploadForm', () => ({
    __esModule: true,
    default: () => <div data-testid="SourceDocUploadForm">UploadForm</div>,
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


describe('SourceDocsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state', () => {
        useSourceDocuments.mockReturnValue({ docs: [], loading: true, error: null, refresh: vi.fn() });
        render(<SourceDocsPage />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders error state', () => {
        useSourceDocuments.mockReturnValue({ docs: [], loading: false, error: 'Failed to load', refresh: vi.fn() });
        render(<SourceDocsPage />);
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });

    it('renders list of documents', () => {
        useSourceDocuments.mockReturnValue({ docs: [{ id: 1, title: 'Doc 1' }], loading: false, error: null, refresh: vi.fn() });
        render(<SourceDocsPage />);
        expect(screen.getByText('Doc 1')).toBeInTheDocument();
        expect(screen.getByTestId('SearchableList')).toBeInTheDocument();
    });
});
