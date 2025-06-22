import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';

// Mock data
const mockSourceDocs = [
    { id: 1, title: 'Test Source Document 1', author: 'Author 1' },
    { id: 2, title: 'Test Source Document 2', author: 'Author 2' }
];

const mockMetaTexts = [
    { id: 1, title: 'Test Meta Text 1', sourcedoc_id: 1 },
    { id: 2, title: 'Test Meta Text 2', sourcedoc_id: 2 }
];

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock Zustand stores
const mockDocumentsStore = {
    sourceDocs: mockSourceDocs,
    sourceDocsLoading: false,
    sourceDocsError: null,
    metaTexts: mockMetaTexts,
    metaTextsLoading: false,
    metaTextsError: null,
    fetchSourceDocs: vi.fn(),
    fetchMetaTexts: vi.fn(),
    deleteSourceDoc: vi.fn(),
    deleteMetaText: vi.fn(),
};

const mockNotifications = {
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showWarning: vi.fn(),
    showInfo: vi.fn(),
    hideNotification: vi.fn(),
    clearAllNotifications: vi.fn(),
};

vi.mock('../../store/documentsStore', () => ({
    useDocumentsStore: () => mockDocumentsStore,
}));

vi.mock('../../store/notificationStore', () => ({
    useNotifications: () => mockNotifications,
}));

// Mock logger
vi.mock('../../utils/logger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock custom hooks
vi.mock('../../hooks/usePageLogger', () => ({
    usePageLogger: vi.fn(),
}));

// Mock child components
vi.mock('../../components/PageContainer', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="page-container">{children}</div>,
}));

vi.mock('../../features/searchablelist/components/SearchableList', () => ({
    default: ({ items, onItemClick, onDeleteClick }: any) => (
        <div data-testid="searchable-list">
            {items.map((item: any) => (
                <div key={item.id} data-testid={`item-${item.id}`}>
                    <span onClick={() => onItemClick(item.id)}>{item.title}</span>
                    <button onClick={(e) => onDeleteClick(item.id, e)}>Delete</button>
                </div>
            ))}
        </div>
    ),
}));

vi.mock('../../components/ErrorBoundary', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>,
}));

vi.mock('../../components/LoadingBoundary', () => ({
    default: ({ children, loading }: { children: React.ReactNode; loading: boolean }) => (
        <div data-testid="loading-boundary">
            {loading ? <div data-testid="loading-indicator">Loading...</div> : children}
        </div>
    ),
}));

vi.mock('../../features/createform/components', () => ({
    default: ({ onSuccess, docType }: any) => (
        <div data-testid="create-form">
            <span>Create Form for {docType}</span>
            <button onClick={onSuccess}>Create Success</button>
        </div>
    ),
}));

function renderWithRouter(ui: React.ReactElement) {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('HomePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockClear();
    });

    it('renders the page with default meta text view', async () => {
        renderWithRouter(<HomePage />);

        expect(screen.getByTestId('page-container')).toBeInTheDocument();
        expect(screen.getByText('Create')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByTestId('create-form')).toBeInTheDocument();
        expect(screen.getByTestId('searchable-list')).toBeInTheDocument();
    });

    it('displays meta texts by default', async () => {
        renderWithRouter(<HomePage />);

        await waitFor(() => {
            expect(screen.getByText('Test Meta Text 1')).toBeInTheDocument();
            expect(screen.getByText('Test Meta Text 2')).toBeInTheDocument();
        });
    });

    it('switches to source documents when toggle is clicked', async () => {
        renderWithRouter(<HomePage />);

        // Click the Source Document toggle button
        const sourceDocButton = screen.getByLabelText('Source Document');
        fireEvent.click(sourceDocButton);

        await waitFor(() => {
            expect(screen.getByText('Test Source Document 1')).toBeInTheDocument();
            expect(screen.getByText('Test Source Document 2')).toBeInTheDocument();
        });
    });

    it('navigates to meta text detail when meta text item is clicked', async () => {
        renderWithRouter(<HomePage />);

        // Click on a meta text item
        const metaTextItem = screen.getByText('Test Meta Text 1');
        fireEvent.click(metaTextItem);

        expect(mockNavigate).toHaveBeenCalledWith('/metaText/1');
    });

    it('navigates to source document detail when source document item is clicked', async () => {
        renderWithRouter(<HomePage />);

        // Switch to source documents
        const sourceDocButton = screen.getByLabelText('Source Document');
        fireEvent.click(sourceDocButton);

        await waitFor(() => {
            const sourceDocItem = screen.getByText('Test Source Document 1');
            fireEvent.click(sourceDocItem);
        });

        expect(mockNavigate).toHaveBeenCalledWith('/source-document/1');
    });

    it('calls delete function when delete button is clicked', async () => {
        renderWithRouter(<HomePage />);

        // Click delete button for a meta text
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);

        expect(mockDocumentsStore.deleteMetaText).toHaveBeenCalledWith(1);
    });

    it('fetches data on mount', () => {
        renderWithRouter(<HomePage />);

        expect(mockDocumentsStore.fetchSourceDocs).toHaveBeenCalled();
        expect(mockDocumentsStore.fetchMetaTexts).toHaveBeenCalled();
    });

    it('refreshes data when create form succeeds', async () => {
        renderWithRouter(<HomePage />);

        // Clear the initial calls
        mockDocumentsStore.fetchSourceDocs.mockClear();
        mockDocumentsStore.fetchMetaTexts.mockClear();

        // Trigger success callback from create form
        const createSuccessButton = screen.getByText('Create Success');
        fireEvent.click(createSuccessButton);

        expect(mockDocumentsStore.fetchSourceDocs).toHaveBeenCalled();
        expect(mockDocumentsStore.fetchMetaTexts).toHaveBeenCalled();
    });

    it('handles document type changes correctly', async () => {
        renderWithRouter(<HomePage />);

        // Initially should show meta texts
        expect(screen.getByText('Test Meta Text 1')).toBeInTheDocument();

        // Click Source Document toggle
        const sourceDocButton = screen.getByLabelText('Source Document');
        fireEvent.click(sourceDocButton);

        // Should now show source documents
        await waitFor(() => {
            expect(screen.getByText('Test Source Document 1')).toBeInTheDocument();
        });

        // Click Meta-Text toggle to go back
        const metaTextButton = screen.getByLabelText('Meta-Text');
        fireEvent.click(metaTextButton);

        // Should show meta texts again
        await waitFor(() => {
            expect(screen.getByText('Test Meta Text 1')).toBeInTheDocument();
        });
    });
});
