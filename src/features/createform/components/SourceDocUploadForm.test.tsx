import './setupTests';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SourceDocUploadForm, { SourceDocUploadFormProps } from '../SourceDocUploadForm';

vi.mock('../services/sourceDocumentService', () => ({
    createSourceDocument: vi.fn(),
}));

import { createSourceDocument } from '../services/sourceDocumentService';

// Use vi.mock and cast to Vitest mock type for proper type inference
const mockedCreateSourceDocument = createSourceDocument as unknown as ReturnType<typeof vi.fn>;

describe('SourceDocUploadForm', () => {
    let refresh: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();
        refresh = vi.fn();
    });

    function setup() {
        render(<SourceDocUploadForm refresh={refresh} />);
    }

    it('renders form fields and upload button', () => {
        setup();
        expect(screen.getByText('New Source Document')).toBeInTheDocument();
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
    });

    it('submit button is disabled until both fields are filled', () => {
        setup();
        const uploadButton = screen.getByRole('button', { name: /upload/i });
        expect(uploadButton).toBeDisabled();

        // Fill only the title
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Doc Title' } });
        expect(uploadButton).toBeDisabled();

        // Fill only the file
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: '' } });
        const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
        const fileInput = screen.getByTestId('file-upload-input')
        fireEvent.change(fileInput, { target: { files: [file] } });
        expect(uploadButton).toBeDisabled();

        // Fill both fields
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Doc Title' } });
        expect(uploadButton).not.toBeDisabled();
    });

    it('calls createSourceDocument and shows success on valid submit', async () => {
        mockedCreateSourceDocument.mockResolvedValueOnce({});
        setup();
        // Simulate file selection
        const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
        const fileInput = screen.getByTestId('file-upload-input');
        fireEvent.change(fileInput, { target: { files: [file] } });
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Doc Title' } });
        fireEvent.click(screen.getByRole('button', { name: /upload/i }));
        expect(mockedCreateSourceDocument).toHaveBeenCalledWith('Doc Title', file);
        await waitFor(() => expect(screen.getByText('Upload successful!')).toBeInTheDocument());
        expect(refresh).toHaveBeenCalled();
    });

    it('shows error if title already exists', async () => {
        mockedCreateSourceDocument.mockRejectedValueOnce(new Error('Title already exists.'));
        setup();
        const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
        const fileInput = screen.getByTestId('file-upload-input');
        fireEvent.change(fileInput, { target: { files: [file] } });
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Doc Title' } });
        fireEvent.click(screen.getByRole('button', { name: /upload/i }));
        expect(await screen.findByText('A document with this title already exists.')).toBeInTheDocument();
    });

    it('shows generic error if upload fails', async () => {
        mockedCreateSourceDocument.mockRejectedValueOnce(new Error('Network error'));
        setup();
        const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
        const fileInput = screen.getByTestId('file-upload-input');
        fireEvent.change(fileInput, { target: { files: [file] } });
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Doc Title' } });
        fireEvent.click(screen.getByRole('button', { name: /upload/i }));
        expect(await screen.findByText('Network error')).toBeInTheDocument();
    });
});

