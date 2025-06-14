// @vitest-environment jsdom

import { describe, it, beforeEach, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MetaTextCreateForm from '../../src/components/MetaTextCreateForm';

// Mock the createMetaText service
vi.mock('../../src/services/metaTextService', () => ({
    createMetaText: vi.fn(),
}));

vi.mock('../../src/utils/logger', () => ({
    __esModule: true,
    default: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
    },
}));

import { createMetaText } from '../../src/services/metaTextService';

const sourceDocs = [
    { id: '1', title: 'Doc 1' },
    { id: '2', title: 'Doc 2' },
];

describe('MetaTextCreateForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form fields and submit button', () => {
        render(
            <MetaTextCreateForm
                sourceDocs={sourceDocs}
                sourceDocsLoading={false}
                sourceDocsError={null}
            />
        );
        expect(screen.getByLabelText(/Meta-text Name/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
    });

    it('shows loading state in button', async () => {
        createMetaText.mockImplementation(() => new Promise(() => { })); // never resolves
        render(
            <MetaTextCreateForm
                sourceDocs={sourceDocs}
                sourceDocsLoading={false}
                sourceDocsError={null}
            />
        );
        fireEvent.change(screen.getByTestId('upload-title').querySelector('input'), { target: { value: 'Test Title' } });
        fireEvent.change(screen.getByTestId('source-doc-select').querySelector('input'), { target: { value: '1' } });
        fireEvent.click(screen.getByRole('button', { name: /Create/i }));
        expect(await screen.findByText(/Creating.../i)).toBeInTheDocument();
    });

    it('calls createMetaText and shows success', async () => {
        createMetaText.mockResolvedValueOnce({});
        const onCreateSuccess = vi.fn();
        render(
            <MetaTextCreateForm
                sourceDocs={sourceDocs}
                sourceDocsLoading={false}
                sourceDocsError={null}
                onCreateSuccess={onCreateSuccess}
            />
        );
        fireEvent.change(screen.getByTestId('upload-title').querySelector('input'), { target: { value: 'Test Title' } });
        fireEvent.change(screen.getByTestId('source-doc-select').querySelector('input'), { target: { value: '1' } });
        fireEvent.click(screen.getByRole('button', { name: /Create/i }));
        expect(await screen.findByText(/Meta-text created!/i)).toBeInTheDocument();
        expect(onCreateSuccess).toHaveBeenCalled();
    });

    it('shows error message on failure', async () => {
        createMetaText.mockRejectedValueOnce(new Error('API failed'));
        render(
            <MetaTextCreateForm
                sourceDocs={sourceDocs}
                sourceDocsLoading={false}
                sourceDocsError={null}
            />
        );
        fireEvent.change(screen.getByTestId('upload-title').querySelector('input'), { target: { value: 'Test Title' } });
        fireEvent.change(screen.getByTestId('source-doc-select').querySelector('input'), { target: { value: '1' } });
        fireEvent.click(screen.getByRole('button', { name: /Create/i }));
        expect(await screen.findByText(/Failed to create meta text/i)).toBeInTheDocument();
        expect(screen.getByText(/API failed/)).toBeInTheDocument();
    });

    it('disables submit button while loading', async () => {
        createMetaText.mockImplementation(() => new Promise(() => { }));
        render(
            <MetaTextCreateForm
                sourceDocs={sourceDocs}
                sourceDocsLoading={false}
                sourceDocsError={null}
            />
        );
        fireEvent.change(screen.getByTestId('upload-title').querySelector('input'), { target: { value: 'Test Title' } });
        fireEvent.change(screen.getByTestId('source-doc-select').querySelector('input'), { target: { value: '1' } });
        fireEvent.click(screen.getByRole('button', { name: /Create/i }));
        expect(screen.getByRole('button', { name: /Creating.../i })).toBeDisabled();
    });
});
