import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SourceDocDetailPage from '../../src/pages/SourceDocPage/SourceDocDetailPage';

vi.mock('../../src/hooks/useSourceDocument', () => ({
    useSourceDocument: () => ({
        doc: { id: 1, title: 'Doc 1', text: 'Some text' },
        loading: false,
        error: '',
        refetch: vi.fn(),
    })
}));
vi.mock('../../src/components/SourceDocInfo', () => ({ default: () => <div data-testid="source-doc-info" /> }));
vi.mock('../../src/styles/pageStyles', () => ({
    sourceDocDetailContainer: {},
    sourceDocDetailLoading: {},
    sourceDocDetailPaper: {},
    sourceDocDetailText: {}
}));


describe('SourceDocDetailPage', () => {
    it('renders doc title, info, and text', () => {
        render(<SourceDocDetailPage />);
        expect(screen.getByText('Doc 1')).toBeInTheDocument();
        expect(screen.getByTestId('source-doc-info')).toBeInTheDocument();
        expect(screen.getByText('Some text')).toBeInTheDocument();
    });
});
