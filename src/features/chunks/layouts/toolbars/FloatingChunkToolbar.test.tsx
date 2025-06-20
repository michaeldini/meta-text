import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import FloatingChunkToolbar from './FloatingChunkToolbar';
import { useChunkStore } from '../../../store/chunkStore';

// Mock the chunk store
vi.mock('../../../store/chunkStore', () => ({
    useChunkStore: vi.fn(),
}));

const mockUseChunkStore = vi.mocked(useChunkStore);

// Create theme for testing
const theme = createTheme();

// Test wrapper component with theme and router
const TestWrapper: React.FC<{ children: React.ReactNode; initialEntries?: string[] }> = ({
    children,
    initialEntries = ['/metaText/123']
}) => (
    <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={initialEntries}>
            {children}
        </MemoryRouter>
    </ThemeProvider>
);

describe('FloatingChunkToolbar', () => {
    const mockSetActiveTabs = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render floating toolbar when there is an active chunk and on MetaTextDetailPage', () => {
        // Mock the store selectors
        mockUseChunkStore.mockImplementation((selector: any) => {
            const state = {
                activeChunkId: 1,
                activeTabs: ['notes-summary'],
                setActiveTabs: mockSetActiveTabs,
            };
            return selector(state);
        });

        render(
            <TestWrapper initialEntries={['/metaText/123']}>
                <FloatingChunkToolbar />
            </TestWrapper>
        );

        expect(screen.getByTestId('floating-chunk-toolbar')).toBeInTheDocument();
        expect(screen.getByTestId('floating-chunk-tools-navbar')).toBeInTheDocument();
    });

    it('should not render when there is no active chunk', () => {
        // Mock the store selectors
        mockUseChunkStore.mockImplementation((selector: any) => {
            const state = {
                activeChunkId: null,
                activeTabs: [],
                setActiveTabs: mockSetActiveTabs,
            };
            return selector(state);
        });

        render(
            <TestWrapper initialEntries={['/metaText/123']}>
                <FloatingChunkToolbar />
            </TestWrapper>
        );

        // The component should still be in DOM but with opacity 0 due to Fade
        const toolbar = screen.getByTestId('floating-chunk-toolbar');
        expect(toolbar).toBeInTheDocument();
        // Check that it has opacity 0 or similar fade out styling
        expect(toolbar).toHaveStyle('pointer-events: none');
    });

    it('should not render when not on MetaTextDetailPage even with active chunk', () => {
        // Mock the store selectors
        mockUseChunkStore.mockImplementation((selector: any) => {
            const state = {
                activeChunkId: 1,
                activeTabs: ['notes-summary'],
                setActiveTabs: mockSetActiveTabs,
            };
            return selector(state);
        });

        render(
            <TestWrapper initialEntries={['/metaText/123/review']}>
                <FloatingChunkToolbar />
            </TestWrapper>
        );

        // The component should still be in DOM but with opacity 0 due to Fade
        const toolbar = screen.getByTestId('floating-chunk-toolbar');
        expect(toolbar).toBeInTheDocument();
        expect(toolbar).toHaveStyle('pointer-events: none');
    });

    it('should render with custom test id and class name', () => {
        mockUseChunkStore.mockImplementation((selector: any) => {
            const state = {
                activeChunkId: 1,
                activeTabs: ['notes-summary'],
                setActiveTabs: mockSetActiveTabs,
            };
            return selector(state);
        });

        render(
            <TestWrapper initialEntries={['/metaText/123']}>
                <FloatingChunkToolbar
                    data-testid="custom-floating-toolbar"
                    className="custom-class"
                />
            </TestWrapper>
        );

        const toolbar = screen.getByTestId('custom-floating-toolbar');
        expect(toolbar).toBeInTheDocument();
        expect(toolbar).toHaveClass('custom-class');
    });

    it('should have correct floating position styles', () => {
        mockUseChunkStore.mockImplementation((selector: any) => {
            const state = {
                activeChunkId: 1,
                activeTabs: ['notes-summary'],
                setActiveTabs: mockSetActiveTabs,
            };
            return selector(state);
        });

        render(
            <TestWrapper initialEntries={['/metaText/123']}>
                <FloatingChunkToolbar />
            </TestWrapper>
        );

        const toolbar = screen.getByTestId('floating-chunk-toolbar');
        expect(toolbar).toHaveStyle('position: fixed');
        // Additional style checks could be added here
    });

    it('should pass floating prop to ChunkToolsNavbar', () => {
        mockUseChunkStore.mockImplementation((selector: any) => {
            const state = {
                activeChunkId: 1,
                activeTabs: ['notes-summary'],
                setActiveTabs: mockSetActiveTabs,
            };
            return selector(state);
        });

        render(
            <TestWrapper initialEntries={['/metaText/123']}>
                <FloatingChunkToolbar />
            </TestWrapper>
        );

        // Check that the nested ChunkToolsNavbar has floating-specific content
        expect(screen.getByTestId('floating-chunk-tools-navbar')).toBeInTheDocument();

        // Should not have the non-floating content like "Active: 1"
        expect(screen.queryByText(/Active: 1/)).not.toBeInTheDocument();
    });
});
