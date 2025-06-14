// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SourceDocUploadForm from '../../src/pages/SourceDocPage/SourceDocUploadForm';
import { createSourceDocument } from '../../src/services/sourceDocumentService';

vi.mock('../../src/components/FileUploadWidget', () => ({
  __esModule: true,
  default: ({ onFileChange }) => (
    <input data-testid="file-input" type="file" onChange={onFileChange} />
  ),
}));
vi.mock('../../src/services/sourceDocumentService', () => ({
  createSourceDocument: vi.fn(),
}));
vi.mock('../../src/utils/logger', () => ({
  __esModule: true,
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('SourceDocUploadForm', () => {
  beforeEach(() => {
    createSourceDocument.mockReset();
  });

  it('renders form fields', () => {
    render(<SourceDocUploadForm />);
    expect(screen.getByTestId('upload-title')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  it('submits form and shows success', async () => {
    createSourceDocument.mockResolvedValueOnce();
    const refresh = vi.fn();
    render(<SourceDocUploadForm refresh={refresh} />);
    fireEvent.change(screen.getByTestId('upload-title').querySelector('input'), { target: { value: 'Test Doc' } });
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
    fireEvent.click(screen.getByText('Upload'));
    await waitFor(() => expect(screen.getByText('Upload successful!')).toBeInTheDocument());
    expect(refresh).toHaveBeenCalled();
  });

  it('shows error if title already exists', async () => {
    createSourceDocument.mockRejectedValueOnce(new Error('Title already exists.'));
    render(<SourceDocUploadForm />);
    fireEvent.change(screen.getByTestId('upload-title').querySelector('input'), { target: { value: 'Test Doc' } });
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
    fireEvent.click(screen.getByText('Upload'));
    await waitFor(() => expect(screen.getByText('A document with this title already exists.')).toBeInTheDocument());
  });

  it('shows generic error on upload failure', async () => {
    createSourceDocument.mockRejectedValueOnce(new Error('Something went wrong'));
    render(<SourceDocUploadForm />);
    fireEvent.change(screen.getByTestId('upload-title').querySelector('input'), { target: { value: 'Test Doc' } });
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
    fireEvent.click(screen.getByText('Upload'));
    await waitFor(() => expect(screen.getByText('Something went wrong')).toBeInTheDocument());
  });

  it('disables upload button while uploading', async () => {
    let resolve;
    createSourceDocument.mockImplementation(() => new Promise(r => { resolve = r; }));
    render(<SourceDocUploadForm />);
    fireEvent.change(screen.getByTestId('upload-title').querySelector('input'), { target: { value: 'Test Doc' } });
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
    fireEvent.click(screen.getByText('Upload'));
    expect(screen.getByText('Uploading...')).toBeDisabled();
    act(() => resolve());
  });
});
