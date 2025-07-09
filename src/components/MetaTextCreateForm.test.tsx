import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import MetaTextCreateForm from './MetaTextCreateForm';
import theme from '../styles/themes';

// Mock the hook
let mockHook = {
    title: '',
    sourceDocId: null,
    loading: false,
    error: null as string | null,
    success: null as string | null,
    isSubmitDisabled: true,
    handleTitleChange: vi.fn(),
    handleSourceDocChange: vi.fn(),
    handleSubmit: vi.fn(),
    clearMessages: vi.fn(),
};

vi.mock('./hooks/useMetaTextCreate', () => ({
    useMetaTextCreate: () => mockHook,
}));

// Mock icons
vi.mock('./icons', () => ({
    StarsIcon: () => <div data-testid="stars-icon">★</div>,
}));

// Mock notifications
vi.mock('store', () => ({
    useNotifications: () => ({
        showSuccess: vi.fn(),
        showError: vi.fn(),
    }),
}));

// Mock services
vi.mock('services', () => ({
    createMetaText: vi.fn(),
}));

// Mock logger
vi.mock('utils', () => ({
    log: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

describe('MetaTextCreateForm', () => {
    const defaultProps = {
        sourceDocs: [
            { id: 1, title: 'Test Document 1', author: 'Test Author' },
            { id: 2, title: 'Test Document 2', author: null },
        ],
        sourceDocsLoading: false,
        sourceDocsError: null,
        onSuccess: vi.fn(),
    };

    const renderForm = (props = {}) => {
        return render(
            <ThemeProvider theme={theme}>
                <MemoryRouter>
                    <MetaTextCreateForm {...defaultProps} {...props} />
                </MemoryRouter>
            </ThemeProvider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mock state
        mockHook.loading = false;
        mockHook.error = null;
        mockHook.success = null;
        mockHook.isSubmitDisabled = true;
    });

    it('renders the form header and description', () => {
        renderForm();

        expect(screen.getByText('Create MetaText')).toBeInTheDocument();
        expect(screen.getByText(/Select a source document and create/)).toBeInTheDocument();
    });

    it('renders source document dropdown', () => {
        renderForm();

        expect(screen.getByLabelText('Select Source Document')).toBeInTheDocument();
    });

    it('renders title input field', () => {
        renderForm();

        expect(screen.getByLabelText('MetaText Title')).toBeInTheDocument();
    });

    it('renders submit button', () => {
        renderForm();

        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
        expect(screen.getByText('Create MetaText')).toBeInTheDocument();
    });

    it('shows loading state when loading', () => {
        mockHook.loading = true;
        renderForm();

        expect(screen.getByText('Creating MetaText...')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows success message when success is set', () => {
        mockHook.success = 'MetaText created successfully!';
        renderForm();

        expect(screen.getByText('MetaText created successfully!')).toBeInTheDocument();
    });

    it('shows error message when error is set', () => {
        mockHook.error = 'Failed to create MetaText';
        renderForm();

        expect(screen.getByText('Failed to create MetaText')).toBeInTheDocument();
    });

    it('shows source docs error when provided', () => {
        renderForm({ sourceDocsError: 'Failed to load source documents' });

        expect(screen.getByText('Failed to load source documents')).toBeInTheDocument();
    });

    it('disables form when loading', () => {
        mockHook.loading = true;
        renderForm();

        expect(screen.getByTestId('source-doc-select')).toBeDisabled();
        expect(screen.getByTestId('title-input')).toBeDisabled();
    });

    it('calls handleSubmit when form is submitted', async () => {
        renderForm();

        const form = screen.getByRole('form') || screen.getByTestId('submit-button').closest('form');
        fireEvent.submit(form!);

        expect(mockHook.handleSubmit).toHaveBeenCalled();
    });
});
