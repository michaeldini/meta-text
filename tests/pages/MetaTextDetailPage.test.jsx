import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../src/styles/theme';
import MetaTextDetailPage from '../../src/pages/MetaTextPage/MetaTextDetailPage';

vi.mock('../../src/hooks/useMetaTextDetail', () => ({
    useMetaTextDetail: () => ({
        metaText: { title: 'Test MetaText' },
        loading: false,
        errors: {},
        sourceDocInfo: { id: 1, title: 'Doc 1' },
        chunks: [],
        setChunks: vi.fn(),
        refetchSourceDoc: vi.fn(),
    })
}));
vi.mock('../../src/hooks/useChunkHandlers', () => ({
    useChunkHandlers: () => ({
        handleWordClick: vi.fn(),
        handleRemoveChunk: vi.fn(),
        handleChunkFieldChange: vi.fn(),
    })
}));
vi.mock('../../src/components/SourceDocInfo', () => ({
    default: () => <div data-testid="source-doc-info">Source Doc Info</div>
}));
vi.mock('../../src/features/Chunks', () => ({
    default: () => <div data-testid="chunks">Chunks Component</div>
}));
vi.mock('../../src/styles/pageStyles', () => ({
    metaTextDetailContainer: {},
    metaTextDetailLoadingContainer: {},
    metaTextDetailLoadingBox: {},
    metaTextDetailAlert: {}
}));
vi.mock('../../src/routes', () => ({ metaTextReviewRoute: vi.fn() }));


describe('MetaTextDetailPage', () => {
    function renderWithRoute() {
        return render(
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={['/metatext/123']}>
                    <MetaTextDetailPage />
                </MemoryRouter>
            </ThemeProvider>
        );
    }

    it('renders without crashing', () => {
        renderWithRoute();
        expect(screen.getByText('Test MetaText')).toBeInTheDocument();
    });
    it('renders SourceDocInfo component', () => {
        renderWithRoute();
        expect(screen.getByTestId('source-doc-info')).toBeInTheDocument();
    });
    it('renders Chunks component', () => {
        renderWithRoute();
        expect(screen.getByTestId('chunks')).toBeInTheDocument();
    });
});
