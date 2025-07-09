import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MetaTextDetailPage from './MetaTextDetailPage';
import theme from '../../styles/themes';

// Mock child components to isolate the test to this page
vi.mock('features', () => ({
    ChunkToolButtons: () => <div data-testid="ChunkToolButtons" />,
    SourceDocInfo: ({ sourceDocumentId }: any) => <div data-testid="SourceDocInfo">{sourceDocumentId}</div>,
    PaginatedChunks: ({ metaTextId }: any) => <div data-testid="PaginatedChunks">{metaTextId}</div>,
}));

vi.mock('components', () => ({
    PageContainer: ({ children, loading }: any) => <div data-testid="PageContainer">{loading ? 'Loading...' : children}</div>,
    ReviewButton: ({ metaTextId }: any) => <button data-testid="ReviewButton">{metaTextId}</button>,
    GenerateSourceDocInfoButton: ({ sourceDocumentId }: any) => <button data-testid="GenerateSourceDocInfoButton">{sourceDocumentId}</button>,
    StyleControls: () => <div data-testid="StyleControls" />,
    DocumentHeader: ({ title, children }: any) => <div data-testid="DocumentHeader">{title}{children}</div>,
}));

vi.mock('./useMetaTextDetailData', () => ({
    useMetaTextDetailData: vi.fn(),
}));

vi.mock('utils', () => ({
    log: vi.fn(),
}));

vi.mock('hooks', () => ({
    usePageLogger: vi.fn(),
}));

vi.mock('./MetaText.styles', () => ({
    getMetaTextPageStyles: vi.fn(() => ({
        container: { padding: 2 },
    })),
}));

import { useMetaTextDetailData } from './useMetaTextDetailData';

describe('MetaTextDetailPage', () => {
    const mockMetaText = {
        id: 123,
        title: 'Test MetaText',
        source_document_id: 456,
        text: 'Test meta text content',
        chunks: [],
    };

    const renderPage = (mockData: any, metaTextId: string = '123') => {
        vi.mocked(useMetaTextDetailData).mockReturnValue(mockData);
        return render(
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={[`/meta-text/${metaTextId}`]}>
                    <Routes>
                        <Route path="/meta-text/:metaTextId" element={<MetaTextDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </ThemeProvider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('URL parameter validation', () => {
        it('should return null when metaTextId is missing', () => {
            render(
                <ThemeProvider theme={theme}>
                    <MemoryRouter initialEntries={['/meta-text/']}>
                        <Routes>
                            <Route path="/meta-text/" element={<MetaTextDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </ThemeProvider>
            );

            expect(screen.queryByTestId('PageContainer')).not.toBeInTheDocument();
        });

        it('should return null when metaTextId is not a number', () => {
            render(
                <ThemeProvider theme={theme}>
                    <MemoryRouter initialEntries={['/meta-text/invalid-id']}>
                        <Routes>
                            <Route path="/meta-text/:metaTextId" element={<MetaTextDetailPage />} />
                        </Routes>
                    </MemoryRouter>
                </ThemeProvider>
            );

            expect(screen.queryByTestId('PageContainer')).not.toBeInTheDocument();
        });

        it('should render when metaTextId is a valid number', () => {
            renderPage(
                { metaText: null, loading: true, errors: { metaText: '' } },
                '123'
            );

            expect(screen.getByTestId('PageContainer')).toBeInTheDocument();
        });

        it('should handle metaTextId with leading zeros', () => {
            renderPage(
                { metaText: null, loading: true, errors: { metaText: '' } },
                '0123'
            );

            expect(screen.getByTestId('PageContainer')).toBeInTheDocument();
        });
    });

    describe('loading states', () => {
        it('should show loading state when data is being fetched', () => {
            renderPage({
                metaText: null,
                loading: true,
                errors: { metaText: '' },
            });

            expect(screen.getByTestId('PageContainer')).toHaveTextContent('Loading...');
            expect(screen.queryByTestId('DocumentHeader')).not.toBeInTheDocument();
        });

        it('should not show loading state when data is loaded', () => {
            renderPage({
                metaText: mockMetaText,
                loading: false,
                errors: { metaText: '' },
            });

            expect(screen.getByTestId('PageContainer')).not.toHaveTextContent('Loading...');
            expect(screen.getByTestId('DocumentHeader')).toBeInTheDocument();
        });
    });

    describe('content rendering', () => {
        it('should render all components when metaText is present', () => {
            renderPage({
                metaText: mockMetaText,
                loading: false,
                errors: { metaText: '' },
            });

            // Check DocumentHeader with title
            expect(screen.getByTestId('DocumentHeader')).toHaveTextContent('Test MetaText');

            // Check all child components are rendered
            expect(screen.getByTestId('ReviewButton')).toHaveTextContent('123');
            expect(screen.getByTestId('GenerateSourceDocInfoButton')).toHaveTextContent('456');
            expect(screen.getByTestId('StyleControls')).toBeInTheDocument();
            expect(screen.getByTestId('SourceDocInfo')).toHaveTextContent('456');
            expect(screen.getByTestId('PaginatedChunks')).toHaveTextContent('123');
            expect(screen.getByTestId('ChunkToolButtons')).toBeInTheDocument();
        });

        it('should not render content when metaText is null', () => {
            renderPage({
                metaText: null,
                loading: false,
                errors: { metaText: '' },
            });

            expect(screen.queryByTestId('DocumentHeader')).not.toBeInTheDocument();
            expect(screen.queryByTestId('ReviewButton')).not.toBeInTheDocument();
            expect(screen.queryByTestId('GenerateSourceDocInfoButton')).not.toBeInTheDocument();
            expect(screen.queryByTestId('StyleControls')).not.toBeInTheDocument();
            expect(screen.queryByTestId('SourceDocInfo')).not.toBeInTheDocument();
            expect(screen.queryByTestId('PaginatedChunks')).not.toBeInTheDocument();
            expect(screen.queryByTestId('ChunkToolButtons')).not.toBeInTheDocument();
        });
    });

    describe('component props', () => {
        it('should pass correct props to ReviewButton', () => {
            renderPage({
                metaText: mockMetaText,
                loading: false,
                errors: { metaText: '' },
            });

            const reviewButton = screen.getByTestId('ReviewButton');
            expect(reviewButton).toHaveTextContent('123'); // metaText.id
        });

        it('should pass correct props to GenerateSourceDocInfoButton', () => {
            renderPage({
                metaText: mockMetaText,
                loading: false,
                errors: { metaText: '' },
            });

            const generateButton = screen.getByTestId('GenerateSourceDocInfoButton');
            expect(generateButton).toHaveTextContent('456'); // metaText.source_document_id
        });

        it('should pass correct props to SourceDocInfo', () => {
            renderPage({
                metaText: mockMetaText,
                loading: false,
                errors: { metaText: '' },
            });

            const sourceDocInfo = screen.getByTestId('SourceDocInfo');
            expect(sourceDocInfo).toHaveTextContent('456'); // metaText.source_document_id
        });

        it('should pass correct props to Chunks', () => {
            renderPage({
                metaText: mockMetaText,
                loading: false,
                errors: { metaText: '' },
            });

            const chunks = screen.getByTestId('PaginatedChunks');
            expect(chunks).toHaveTextContent('123'); // metaText.id
        });

        it('should pass title to DocumentHeader', () => {
            const customMetaText = {
                ...mockMetaText,
                title: 'Custom Title',
            };

            renderPage({
                metaText: customMetaText,
                loading: false,
                errors: { metaText: '' },
            });

            const documentHeader = screen.getByTestId('DocumentHeader');
            expect(documentHeader).toHaveTextContent('Custom Title');
        });
    });

    describe('hook integration', () => {
        it('should call useMetaTextDetailData with metaTextId from URL', () => {
            renderPage({
                metaText: mockMetaText,
                loading: false,
                errors: { metaText: '' },
            });

            expect(useMetaTextDetailData).toHaveBeenCalledWith('123');
        });

        it('should call useMetaTextDetailData with different metaTextId', () => {
            renderPage(
                {
                    metaText: { ...mockMetaText, id: 789 },
                    loading: false,
                    errors: { metaText: '' },
                },
                '789'
            );

            expect(useMetaTextDetailData).toHaveBeenCalledWith('789');
        });
    });

    describe('animation and styling', () => {
        it('should render content inside Slide animation when metaText is present', () => {
            renderPage({
                metaText: mockMetaText,
                loading: false,
                errors: { metaText: '' },
            });

            // Since we can't easily test MUI animations, we just verify the content structure
            expect(screen.getByTestId('DocumentHeader')).toBeInTheDocument();
            expect(screen.getByTestId('PaginatedChunks')).toBeInTheDocument();
        });

        it('should not render Slide animation when metaText is null', () => {
            renderPage({
                metaText: null,
                loading: false,
                errors: { metaText: '' },
            });

            expect(screen.queryByTestId('DocumentHeader')).not.toBeInTheDocument();
        });
    });

    describe('error scenarios', () => {
        it('should render PageContainer even when metaText is null and there are errors', () => {
            renderPage({
                metaText: null,
                loading: false,
                errors: { metaText: 'MetaText not found' },
            });

            expect(screen.getByTestId('PageContainer')).toBeInTheDocument();
            expect(screen.queryByTestId('DocumentHeader')).not.toBeInTheDocument();
        });

        it('should render content even when there are non-critical errors', () => {
            renderPage({
                metaText: mockMetaText,
                loading: false,
                errors: { metaText: 'Warning: Some data may be outdated' },
            });

            // Content should still render if metaText is available
            expect(screen.getByTestId('DocumentHeader')).toBeInTheDocument();
            expect(screen.getByTestId('PaginatedChunks')).toBeInTheDocument();
        });
    });

    describe('edge cases', () => {
        it('should handle metaText with minimal data', () => {
            const minimalMetaText = {
                id: 1,
                title: '',
                source_document_id: 0,
                text: '',
                chunks: [],
            };

            renderPage({
                metaText: minimalMetaText,
                loading: false,
                errors: { metaText: '' },
            });

            expect(screen.getByTestId('DocumentHeader')).toBeInTheDocument();
            expect(screen.getByTestId('ReviewButton')).toHaveTextContent('1');
            expect(screen.getByTestId('GenerateSourceDocInfoButton')).toHaveTextContent('0');
            expect(screen.getByTestId('SourceDocInfo')).toHaveTextContent('0');
            expect(screen.getByTestId('PaginatedChunks')).toHaveTextContent('1');
        });

        it('should handle metaText with very long title', () => {
            const longTitleMetaText = {
                ...mockMetaText,
                title: 'This is a very long title that might cause layout issues if not handled properly',
            };

            renderPage({
                metaText: longTitleMetaText,
                loading: false,
                errors: { metaText: '' },
            });

            const documentHeader = screen.getByTestId('DocumentHeader');
            expect(documentHeader).toHaveTextContent('This is a very long title that might cause layout issues if not handled properly');
        });

        it('should handle large metaTextId numbers', () => {
            const largeIdMetaText = {
                ...mockMetaText,
                id: 999999999,
                source_document_id: 888888888,
            };

            renderPage({
                metaText: largeIdMetaText,
                loading: false,
                errors: { metaText: '' },
            });

            expect(screen.getByTestId('ReviewButton')).toHaveTextContent('999999999');
            expect(screen.getByTestId('GenerateSourceDocInfoButton')).toHaveTextContent('888888888');
            expect(screen.getByTestId('SourceDocInfo')).toHaveTextContent('888888888');
            expect(screen.getByTestId('PaginatedChunks')).toHaveTextContent('999999999');
        });
    });
});
