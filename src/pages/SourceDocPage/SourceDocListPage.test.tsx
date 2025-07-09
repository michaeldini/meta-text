import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import SourceDocListPage from './SourceDocListPage';
import theme from '../../styles/themes';

// Mock the store
const mockStore = {
    sourceDocs: [] as any[],
    sourceDocsLoading: false,
    sourceDocsError: null,
    fetchSourceDocs: vi.fn(),
};

vi.mock('store', () => ({
    useDocumentsStore: () => mockStore,
}));

// Mock the SearchableList component
vi.mock('features', () => ({
    SearchableList: ({ items, title, loading }: any) => (
        <div data-testid="SearchableList">
            <div data-testid="title">{title}</div>
            <div data-testid="loading">{loading ? 'loading' : 'not loading'}</div>
            <div data-testid="items-count">{items?.length || 0}</div>
        </div>
    ),
}));

// Mock other components
vi.mock('components', () => ({
    PageContainer: ({ children, loading }: any) => (
        <div data-testid="PageContainer">
            {loading ? 'Loading...' : children}
        </div>
    ),
}));

vi.mock('hooks', () => ({
    usePageLogger: vi.fn(),
}));

describe('SourceDocListPage', () => {
    const renderPage = () => {
        return render(
            <ThemeProvider theme={theme}>
                <MemoryRouter>
                    <SourceDocListPage />
                </MemoryRouter>
            </ThemeProvider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the page title and description', () => {
        renderPage();

        expect(screen.getByText('Source Documents')).toBeInTheDocument();
        expect(screen.getByText(/Browse and select source documents/)).toBeInTheDocument();
    });

    it('renders SearchableList with correct props', () => {
        const sourceDocs = [
            { id: 1, title: 'Document 1' },
            { id: 2, title: 'Document 2' },
        ];
        mockStore.sourceDocs = sourceDocs;

        renderPage();

        expect(screen.getByTestId('SearchableList')).toBeInTheDocument();
        expect(screen.getByTestId('title')).toHaveTextContent('sourceDoc');
        expect(screen.getByTestId('items-count')).toHaveTextContent('2');
    });

    it('shows loading state', () => {
        mockStore.sourceDocsLoading = true;

        renderPage();

        expect(screen.getByTestId('PageContainer')).toHaveTextContent('Loading...');
    });

    it('calls fetchSourceDocs on mount', () => {
        renderPage();

        expect(mockStore.fetchSourceDocs).toHaveBeenCalledTimes(1);
    });

    it('passes loading state to SearchableList when not loading', () => {
        mockStore.sourceDocsLoading = false;

        renderPage();

        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
    });
});
