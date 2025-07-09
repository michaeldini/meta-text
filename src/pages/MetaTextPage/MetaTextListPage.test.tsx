import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import MetaTextListPage from './MetaTextListPage';
import theme from '../../styles/themes';

// Mock the store
const mockStore = {
    metaTexts: [] as any[],
    metaTextsLoading: false,
    metaTextsError: null,
    fetchMetaTexts: vi.fn(),
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
    MetaTextCreateForm: ({ sourceDocs, onSuccess }: any) => (
        <div data-testid="MetaTextCreateForm">
            <div data-testid="source-docs-count">{sourceDocs?.length || 0}</div>
            <button onClick={onSuccess} data-testid="create-success-button">
                Simulate Success
            </button>
        </div>
    ),
}));

vi.mock('hooks', () => ({
    usePageLogger: vi.fn(),
}));

describe('MetaTextListPage', () => {
    const renderPage = () => {
        return render(
            <ThemeProvider theme={theme}>
                <MemoryRouter>
                    <MetaTextListPage />
                </MemoryRouter>
            </ThemeProvider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mock store state
        mockStore.metaTexts = [];
        mockStore.metaTextsLoading = false;
        mockStore.metaTextsError = null;
        mockStore.sourceDocs = [];
        mockStore.sourceDocsLoading = false;
        mockStore.sourceDocsError = null;
    });

    it('renders the page title and description', () => {
        renderPage();

        expect(screen.getByText('MetaText Documents')).toBeInTheDocument();
        expect(screen.getByText(/Create new MetaText documents/)).toBeInTheDocument();
    });

    it('renders MetaTextCreateForm', () => {
        renderPage();

        expect(screen.getByTestId('MetaTextCreateForm')).toBeInTheDocument();
    });

    it('renders SearchableList with correct props', () => {
        const metaTexts = [
            { id: 1, title: 'MetaText 1' },
            { id: 2, title: 'MetaText 2' },
        ];
        mockStore.metaTexts = metaTexts;

        renderPage();

        expect(screen.getByTestId('SearchableList')).toBeInTheDocument();
        expect(screen.getByTestId('title')).toHaveTextContent('metaText');
        expect(screen.getByTestId('items-count')).toHaveTextContent('2');
    });

    it('shows loading state', () => {
        mockStore.metaTextsLoading = true;

        renderPage();

        expect(screen.getByTestId('PageContainer')).toHaveTextContent('Loading...');
    });

    it('calls fetchMetaTexts and fetchSourceDocs on mount', () => {
        renderPage();

        expect(mockStore.fetchMetaTexts).toHaveBeenCalledTimes(1);
        expect(mockStore.fetchSourceDocs).toHaveBeenCalledTimes(1);
    });

    it('passes source docs to create form', () => {
        const sourceDocs = [
            { id: 1, title: 'Source 1' },
            { id: 2, title: 'Source 2' },
        ];
        mockStore.sourceDocs = sourceDocs;

        renderPage();

        expect(screen.getByTestId('source-docs-count')).toHaveTextContent('2');
    });

    it('passes loading state to SearchableList when not loading', () => {
        mockStore.metaTextsLoading = false;

        renderPage();

        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
    });
});
