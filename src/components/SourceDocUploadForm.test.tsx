import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SourceDocUploadForm from './SourceDocUploadForm';
import theme from '../styles/themes';

// Mock the services
vi.mock('services', () => ({
    createSourceDocument: vi.fn(),
}));

// Mock the store
vi.mock('store', () => ({
    useNotifications: () => ({
        showSuccess: vi.fn(),
        showError: vi.fn(),
    }),
}));

// Mock the utils
vi.mock('utils', () => ({
    log: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock icons
vi.mock('icons', () => ({
    FileUploadIcon: ({ sx }: any) => <div data-testid="file-upload-icon" style={sx} />,
}));

const renderComponent = (props = {}) => {
    return render(
        <ThemeProvider theme={theme}>
            <SourceDocUploadForm {...props} />
        </ThemeProvider>
    );
};

describe('SourceDocUploadForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Component Rendering', () => {
        it('renders the upload form with all elements', () => {
            renderComponent();

            expect(screen.getByText('Upload Source Document')).toBeInTheDocument();
            expect(screen.getByText(/Upload a text file to create/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Select File/)).toBeInTheDocument();
            expect(screen.getByLabelText('Document Title')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Upload Document/ })).toBeInTheDocument();
        });

        it('renders file upload area with correct styling and content', () => {
            renderComponent();

            expect(screen.getByText('Choose a file')).toBeInTheDocument();
            expect(screen.getByText(/Drag & drop or click to select/)).toBeInTheDocument();
            expect(screen.getByText(/Supported formats: .txt, .doc, .docx, .pdf/)).toBeInTheDocument();
            expect(screen.getByTestId('file-upload-icon')).toBeInTheDocument();
        });

        it('renders submit button as disabled initially', () => {
            renderComponent();

            const submitButton = screen.getByRole('button', { name: /Upload Document/ });
            expect(submitButton).toBeDisabled();
        });
    });

    describe('User Interactions', () => {
        it('enables submit button when both title and file are provided', async () => {
            const user = userEvent.setup();
            renderComponent();

            const titleInput = screen.getByLabelText('Document Title');
            const fileInput = screen.getByTestId('file-input');
            const submitButton = screen.getByRole('button', { name: /Upload Document/ });

            // Initially disabled
            expect(submitButton).toBeDisabled();

            // Add title
            await user.type(titleInput, 'Test Document');
            expect(submitButton).toBeDisabled(); // Still disabled without file

            // Add file
            const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
            await user.upload(fileInput, file);

            // Should be enabled now
            expect(submitButton).toBeEnabled();
        });

        it('updates title input correctly', async () => {
            const user = userEvent.setup();
            renderComponent();

            const titleInput = screen.getByLabelText('Document Title');
            await user.type(titleInput, 'My Test Document');

            expect(titleInput).toHaveValue('My Test Document');
        });

        it('handles file selection and displays file info', async () => {
            const user = userEvent.setup();
            renderComponent();

            const fileInput = screen.getByTestId('file-input');
            const file = new File(['test content'], 'test-document.txt', { type: 'text/plain' });

            await user.upload(fileInput, file);

            expect(screen.getByText('test-document.txt')).toBeInTheDocument();
            expect(screen.getByText(/Selected:/)).toBeInTheDocument();
        });

        it('calls onSuccess callback when provided', async () => {
            const mockOnSuccess = vi.fn();
            const mockCreateSourceDocument = vi.fn().mockResolvedValue({});

            vi.doMock('services', () => ({
                createSourceDocument: mockCreateSourceDocument,
            }));

            const user = userEvent.setup();
            renderComponent({ onSuccess: mockOnSuccess });

            const titleInput = screen.getByLabelText('Document Title');
            const fileInput = screen.getByTestId('file-input');
            const submitButton = screen.getByRole('button', { name: /Upload Document/ });

            // Fill form
            await user.type(titleInput, 'Test Document');
            const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
            await user.upload(fileInput, file);

            // Submit form
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSuccess).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('Form Validation', () => {
        it('shows validation message when title is missing', async () => {
            const user = userEvent.setup();
            renderComponent();

            const fileInput = screen.getByTestId('file-input');
            const submitButton = screen.getByRole('button', { name: /Upload Document/ });

            // Add file but no title
            const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
            await user.upload(fileInput, file);

            // Try to submit
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/Please enter a title/)).toBeInTheDocument();
            });
        });

        it('shows validation message when file is missing', async () => {
            const user = userEvent.setup();
            renderComponent();

            const titleInput = screen.getByLabelText('Document Title');
            const submitButton = screen.getByRole('button', { name: /Upload Document/ });

            // Add title but no file
            await user.type(titleInput, 'Test Document');

            // Submit button should be disabled
            expect(submitButton).toBeDisabled();
        });

        it('validates file type and shows error for invalid files', async () => {
            const user = userEvent.setup();
            renderComponent();

            const fileInput = screen.getByTestId('file-input');

            // Try to upload invalid file type
            const invalidFile = new File(['test content'], 'test.mp3', { type: 'audio/mpeg' });
            await user.upload(fileInput, invalidFile);

            await waitFor(() => {
                expect(screen.getByText(/Please select a valid file type/)).toBeInTheDocument();
            });
        });

        it('validates file size and shows error for large files', async () => {
            const user = userEvent.setup();
            renderComponent();

            const fileInput = screen.getByTestId('file-input');

            // Create a large file (11MB)
            const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.txt', { type: 'text/plain' });
            await user.upload(fileInput, largeFile);

            await waitFor(() => {
                expect(screen.getByText(/File size must be less than 10MB/)).toBeInTheDocument();
            });
        });
    });

    describe('Loading States', () => {
        it('shows loading state during submission', async () => {
            const mockCreateSourceDocument = vi.fn().mockImplementation(() =>
                new Promise(resolve => setTimeout(resolve, 100))
            );

            vi.doMock('services', () => ({
                createSourceDocument: mockCreateSourceDocument,
            }));

            const user = userEvent.setup();
            renderComponent();

            const titleInput = screen.getByLabelText('Document Title');
            const fileInput = screen.getByTestId('file-input');
            const submitButton = screen.getByRole('button', { name: /Upload Document/ });

            // Fill form
            await user.type(titleInput, 'Test Document');
            const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
            await user.upload(fileInput, file);

            // Submit form
            await user.click(submitButton);

            // Check loading state
            expect(screen.getByText('Uploading...')).toBeInTheDocument();
            expect(screen.getByText('Uploading document...')).toBeInTheDocument();
            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has proper accessibility attributes', () => {
            renderComponent();

            const fileUploadArea = screen.getByRole('button', { name: /Click to select file for upload/ });
            expect(fileUploadArea).toHaveAttribute('tabIndex', '0');

            const titleInput = screen.getByLabelText('Document Title');
            expect(titleInput).toHaveAttribute('required');

            const fileInput = screen.getByTestId('file-input');
            expect(fileInput).toHaveAttribute('accept', '.txt,.doc,.docx,.pdf');
        });

        it('supports keyboard navigation for file selection', async () => {
            const user = userEvent.setup();
            renderComponent();

            const fileUploadArea = screen.getByRole('button', { name: /Click to select file for upload/ });

            // Should be focusable
            fileUploadArea.focus();
            expect(fileUploadArea).toHaveFocus();

            // Should trigger file input on Enter key
            await user.keyboard('{Enter}');
            // Note: In a real test environment, this would trigger the file dialog
        });
    });
});
