import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChunkToolsNavbar from '../../chunk/toolbar/ChunkToolsNavbar';
import { useChunkStore } from '../../../store/chunkStore';

// Mock the chunk store
vi.mock('store/chunkStore', () => ({
    useChunkStore: vi.fn(),
}));

const mockUseChunkStore = vi.mocked(useChunkStore);

describe('ChunkToolsNavbar', () => {
    const mockSetActiveTabs = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render when there is an active chunk', () => {
        // Mock the store selectors
        mockUseChunkStore.mockImplementation((selector: any) => {
            const state = {
                activeChunkId: 1,
                activeTabs: ['notes-summary'],
                setActiveTabs: mockSetActiveTabs,
            };
            return selector(state);
        });

        render(<ChunkToolsNavbar />);

        expect(screen.getByTestId('chunk-tools-navbar')).toBeInTheDocument();
        expect(screen.getByText('Active: 1')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /show notes\/summary/i })).toBeInTheDocument();
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

        const { container } = render(<ChunkToolsNavbar />);

        expect(container.firstChild).toBeNull();
    });

    it('should show notes-summary tool as active by default', () => {
        // Mock the store selectors
        mockUseChunkStore.mockImplementation((selector: any) => {
            const state = {
                activeChunkId: 1,
                activeTabs: ['notes-summary'],
                setActiveTabs: mockSetActiveTabs,
            };
            return selector(state);
        });

        render(<ChunkToolsNavbar />);

        const notesSummaryButton = screen.getByRole('button', { name: /show notes\/summary/i });
        expect(notesSummaryButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should show multiple tools as active when selected', () => {
        // Mock the store selectors  
        mockUseChunkStore.mockImplementation((selector: any) => {
            const state = {
                activeChunkId: 1,
                activeTabs: ['notes-summary', 'comparison', 'ai-image'],
                setActiveTabs: mockSetActiveTabs,
            };
            return selector(state);
        });

        render(<ChunkToolsNavbar />);

        expect(screen.getByRole('button', { name: /show notes\/summary/i })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: /show comparison/i })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: /show ai image/i })).toHaveAttribute('aria-pressed', 'true');
    });

    it('should render differently when isFloating is true', () => {
        mockUseChunkStore.mockImplementation((selector: any) => {
            const state = {
                activeChunkId: 1,
                activeTabs: ['notes-summary'],
                setActiveTabs: mockSetActiveTabs,
            };
            return selector(state);
        });

        render(<ChunkToolsNavbar isFloating={true} />);

        // Should show vertical orientation for floating
        const toggleButtonGroup = screen.getByRole('group');
        expect(toggleButtonGroup).toBeInTheDocument();

        // Should not show non-floating content
        expect(screen.queryByText(/Active: 1/)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /dialogue/i })).not.toBeInTheDocument();
    });

    it('should render differently when isFloating is false', () => {
        mockUseChunkStore.mockImplementation((selector: any) => {
            const state = {
                activeChunkId: 1,
                activeTabs: ['notes-summary'],
                setActiveTabs: mockSetActiveTabs,
            };
            return selector(state);
        });

        render(<ChunkToolsNavbar isFloating={false} />);

        // Should show non-floating content
        expect(screen.getByText('Active: 1')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /dialogue/i })).toBeInTheDocument();

        // Should not show floating-specific content
        expect(screen.queryByText('Chunk Tools')).not.toBeInTheDocument();
    });

    it('should accept custom className and data-testid', () => {
        mockUseChunkStore.mockImplementation((selector: any) => {
            const state = {
                activeChunkId: 1,
                activeTabs: ['notes-summary'],
                setActiveTabs: mockSetActiveTabs,
            };
            return selector(state);
        });

        render(
            <ChunkToolsNavbar
                className="custom-class"
                data-testid="custom-test-id"
            />
        );

        const navbar = screen.getByTestId('custom-test-id');
        expect(navbar).toBeInTheDocument();
        expect(navbar).toHaveClass('custom-class');
    });
});
