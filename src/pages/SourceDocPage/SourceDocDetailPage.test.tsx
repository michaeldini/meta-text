import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import SourceDocDetailPage from './SourceDocDetailPage';
import theme from '../../styles/themes';

// Mock child components to isolate the test to this page
vi.mock('features', () => ({
    SourceDocInfo: ({ sourceDocumentId }: any) => <div data-testid="SourceDocInfo">{sourceDocumentId}</div>,
    SourceDoc: ({ doc }: any) => <div data-testid="SourceDoc">{doc?.title}</div>,
}));
vi.mock('components', () => ({
    PageContainer: ({ children, loading }: any) => <div data-testid="PageContainer">{loading ? 'Loading...' : children}</div>,
    GenerateSourceDocInfoButton: ({ sourceDocumentId }: any) => <button data-testid="GenerateSourceDocInfoButton">{sourceDocumentId}</button>,
    StyleControls: () => <div data-testid="StyleControls" />,
    DocumentHeader: ({ title, children }: any) => <div data-testid="DocumentHeader">{title}{children}</div>,
}));
vi.mock('./useSourceDocDetailData', () => ({
    useSourceDocDetailData: vi.fn(),
}));

import { useSourceDocDetailData } from './useSourceDocDetailData';

describe('SourceDocDetailPage', () => {
    const renderPage = (mockData: any) => {
        vi.mocked(useSourceDocDetailData).mockReturnValue(mockData);
        return render(
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={["/docs/123"]}>
                    <Routes>
                        <Route path="/docs/:sourceDocId" element={<SourceDocDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </ThemeProvider>
        );
    };

    it('shows loading state', () => {
        renderPage({ doc: null, loading: true, error: null, refetch: vi.fn() });
        expect(screen.getByTestId('PageContainer')).toHaveTextContent('Loading...');
    });

    it('shows document details when doc is present', () => {
        renderPage({ doc: { id: '123', title: 'Test Doc' }, loading: false, error: null, refetch: vi.fn() });
        expect(screen.getByTestId('DocumentHeader')).toHaveTextContent('Test Doc');
        expect(screen.getByTestId('GenerateSourceDocInfoButton')).toHaveTextContent('123');
        expect(screen.getByTestId('StyleControls')).toBeInTheDocument();
        expect(screen.getByTestId('SourceDocInfo')).toHaveTextContent('123');
        expect(screen.getByTestId('SourceDoc')).toHaveTextContent('Test Doc');
    });

    it('shows not found alert when doc is missing', () => {
        renderPage({ doc: null, loading: false, error: null, refetch: vi.fn() });
        expect(screen.getByText('Document not found.')).toBeInTheDocument();
    });
});
