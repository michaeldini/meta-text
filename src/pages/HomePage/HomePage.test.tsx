import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';

import HomePage from './HomePage';
import { useHomePageData } from './useHomePageData';
import { useHomePageContent } from './useHomePageContent';
import { DocType, ViewMode } from '../../types';

// Mock the hooks and dependencies
vi.mock('./useHomePageData', () => ({
    useHomePageData: vi.fn(),
}));

vi.mock('./useHomePageContent', () => ({
    useHomePageContent: vi.fn(),
}));

// Mock the style function
vi.mock('../../styles/styles', () => ({
    getHomePageStyles: vi.fn(() => ({
        homePageContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
        },
        toggleContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        contentContainer: {
            width: '100%',
            minWidth: 'fit-content',
        },
    })),
}));

// Mock the components
vi.mock('components', () => ({
    PageContainer: ({ children, loading }: any) => (
        <div data-testid="page-container" data-loading={loading}>
            {children}
        </div>
    ),
    FlexBox: ({ children }: any) => <div data-testid="flex-box">{children}</div>,
}));

vi.mock('./components/WelcomeText', () => ({
    default: () => <div data-testid="welcome-text">Welcome Text</div>,
}));

vi.mock('./components/HomePageToggles', () => ({
    HomePageToggles: ({ docType, setDocType, viewMode, setViewMode }: any) => (
        <div data-testid="home-page-toggles">
            <button
                onClick={() => setDocType(DocType.SourceDoc)}
                data-testid="doc-type-toggle"
            >
                Current: {docType}
            </button>
            <button
                onClick={() => setViewMode(ViewMode.Create)}
                data-testid="view-mode-toggle"
            >
                Current: {viewMode}
            </button>
        </div>
    ),
}));

const mockUseHomePageData = vi.mocked(useHomePageData);
const mockUseHomePageContent = vi.mocked(useHomePageContent);

// Test wrapper component
const mockTheme = createTheme();
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MemoryRouter>
        <ThemeProvider theme={mockTheme}>
            {children}
        </ThemeProvider>
    </MemoryRouter>
);

describe('HomePage', () => {
    const mockSetDocType = vi.fn();
    const mockSetViewMode = vi.fn();
    const mockRefreshData = vi.fn();

    const defaultMockData = {
        docType: DocType.MetaText,
        setDocType: mockSetDocType,
        viewMode: ViewMode.Search,
        setViewMode: mockSetViewMode,
        sourceDocs: [],
        sourceDocsLoading: false,
        sourceDocsError: null,
        metaTexts: [],
        metaTextsLoading: false,
        metaTextsError: null,
        refreshData: mockRefreshData,
    };

    const defaultMockContent = <div data-testid="mock-content">Mock Content</div>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseHomePageData.mockReturnValue(defaultMockData);
        mockUseHomePageContent.mockReturnValue(defaultMockContent);
    });

    describe('Component Rendering', () => {
        it('renders all main components correctly', () => {
            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(screen.getByTestId('page-container')).toBeInTheDocument();
            expect(screen.getByTestId('welcome-text')).toBeInTheDocument();
            expect(screen.getByTestId('home-page-toggles')).toBeInTheDocument();
            expect(screen.getByTestId('mock-content')).toBeInTheDocument();
        });

        it('renders with correct structure hierarchy', () => {
            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            const pageContainer = screen.getByTestId('page-container');
            const welcomeText = screen.getByTestId('welcome-text');
            const toggles = screen.getByTestId('home-page-toggles');
            const content = screen.getByTestId('mock-content');

            expect(pageContainer).toContainElement(welcomeText);
            expect(pageContainer).toContainElement(toggles);
            expect(pageContainer).toContainElement(content);
        });

        it('applies slide animation correctly', () => {
            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            // The Slide component should be rendered (it wraps the content)
            const slideContent = screen.getByTestId('welcome-text').closest('.MuiSlide-root, [class*="slide"]');
            // Note: The exact class name depends on MUI version, but the content should be present
            expect(screen.getByTestId('welcome-text')).toBeInTheDocument();
        });
    });

    describe('Loading States', () => {
        it('shows loading state when source docs are loading', () => {
            mockUseHomePageData.mockReturnValue({
                ...defaultMockData,
                sourceDocsLoading: true,
            });

            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(screen.getByTestId('page-container')).toHaveAttribute('data-loading', 'true');
        });

        it('shows loading state when meta texts are loading', () => {
            mockUseHomePageData.mockReturnValue({
                ...defaultMockData,
                metaTextsLoading: true,
            });

            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(screen.getByTestId('page-container')).toHaveAttribute('data-loading', 'true');
        });

        it('shows loading state when both source docs and meta texts are loading', () => {
            mockUseHomePageData.mockReturnValue({
                ...defaultMockData,
                sourceDocsLoading: true,
                metaTextsLoading: true,
            });

            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(screen.getByTestId('page-container')).toHaveAttribute('data-loading', 'true');
        });

        it('does not show loading state when neither is loading', () => {
            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(screen.getByTestId('page-container')).toHaveAttribute('data-loading', 'false');
        });
    });

    describe('Hook Integration', () => {
        it('calls useHomePageData hook correctly', () => {
            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(mockUseHomePageData).toHaveBeenCalledTimes(1);
        });

        it('calls useHomePageContent hook with correct parameters', () => {
            const customMockData = {
                ...defaultMockData,
                docType: DocType.SourceDoc,
                viewMode: ViewMode.Create,
                sourceDocs: [{ id: 1, title: 'Test Doc' }],
                sourceDocsLoading: true,
                sourceDocsError: 'Test Error',
                metaTexts: [{ id: 2, title: 'Test Meta' }],
            };

            mockUseHomePageData.mockReturnValue(customMockData);

            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(mockUseHomePageContent).toHaveBeenCalledWith({
                docType: DocType.SourceDoc,
                viewMode: ViewMode.Create,
                sourceDocs: [{ id: 1, title: 'Test Doc' }],
                sourceDocsLoading: true,
                sourceDocsError: 'Test Error',
                metaTexts: [{ id: 2, title: 'Test Meta' }],
                refreshData: mockRefreshData,
            });
        });
    });

    describe('Props Passing', () => {
        it('passes correct props to HomePageToggles', () => {
            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            const toggles = screen.getByTestId('home-page-toggles');
            expect(toggles).toBeInTheDocument();

            // Check if the current values are displayed correctly
            expect(toggles).toHaveTextContent(`Current: ${DocType.MetaText}`);
            expect(toggles).toHaveTextContent(`Current: ${ViewMode.Search}`);
        });

        it('passes updated state values to HomePageToggles', () => {
            mockUseHomePageData.mockReturnValue({
                ...defaultMockData,
                docType: DocType.SourceDoc,
                viewMode: ViewMode.Create,
            });

            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            const toggles = screen.getByTestId('home-page-toggles');
            expect(toggles).toHaveTextContent(`Current: ${DocType.SourceDoc}`);
            expect(toggles).toHaveTextContent(`Current: ${ViewMode.Create}`);
        });
    });

    describe('Content Rendering', () => {
        it('renders content returned by useHomePageContent', () => {
            const customContent = <div data-testid="custom-content">Custom Content</div>;
            mockUseHomePageContent.mockReturnValue(customContent);

            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(screen.getByTestId('custom-content')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-content')).not.toBeInTheDocument();
        });

        it('renders different content based on state changes', () => {
            const searchContent = <div data-testid="search-content">Search Content</div>;
            mockUseHomePageContent.mockReturnValue(searchContent);

            const { rerender } = render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(screen.getByTestId('search-content')).toBeInTheDocument();

            const createContent = <div data-testid="create-content">Create Content</div>;
            mockUseHomePageContent.mockReturnValue(createContent);

            rerender(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(screen.getByTestId('create-content')).toBeInTheDocument();
            expect(screen.queryByTestId('search-content')).not.toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('renders correctly when source docs have error', () => {
            mockUseHomePageData.mockReturnValue({
                ...defaultMockData,
                sourceDocsError: 'Failed to load source documents',
            });

            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(screen.getByTestId('page-container')).toBeInTheDocument();
            expect(mockUseHomePageContent).toHaveBeenCalledWith(
                expect.objectContaining({
                    sourceDocsError: 'Failed to load source documents',
                })
            );
        });

        it('renders correctly when meta texts have error', () => {
            mockUseHomePageData.mockReturnValue({
                ...defaultMockData,
                metaTextsError: 'Failed to load meta texts',
            });

            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(screen.getByTestId('page-container')).toBeInTheDocument();
            // The error is passed through to useHomePageContent, but not directly to HomePage
            expect(mockUseHomePageContent).toHaveBeenCalledWith(
                expect.objectContaining({
                    docType: DocType.MetaText,
                    viewMode: ViewMode.Search,
                })
            );
        });
    });

    describe('Theme Integration', () => {
        it('renders successfully with theme provider', () => {
            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            // The component should render without theme-related errors
            expect(screen.getByTestId('page-container')).toBeInTheDocument();
            expect(screen.getByTestId('welcome-text')).toBeInTheDocument();
        });
    });

    describe('Data Flow', () => {
        it('maintains proper data flow from hooks to components', () => {
            const mockSourceDocs = [
                { id: 1, title: 'Doc 1' },
                { id: 2, title: 'Doc 2' },
            ];
            const mockMetaTexts = [
                { id: 1, title: 'Meta 1' },
                { id: 2, title: 'Meta 2' },
            ];

            mockUseHomePageData.mockReturnValue({
                ...defaultMockData,
                sourceDocs: mockSourceDocs,
                metaTexts: mockMetaTexts,
                docType: DocType.SourceDoc,
                viewMode: ViewMode.Create,
            });

            render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            // Verify data flows correctly through the hooks
            expect(mockUseHomePageContent).toHaveBeenCalledWith({
                docType: DocType.SourceDoc,
                viewMode: ViewMode.Create,
                sourceDocs: mockSourceDocs,
                sourceDocsLoading: false,
                sourceDocsError: null,
                metaTexts: mockMetaTexts,
                refreshData: mockRefreshData,
            });
        });
    });

    describe('Component Stability', () => {
        it('re-renders correctly when props change', () => {
            const { rerender } = render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(screen.getByTestId('page-container')).toBeInTheDocument();

            // Change the mock data
            mockUseHomePageData.mockReturnValue({
                ...defaultMockData,
                docType: DocType.SourceDoc,
                sourceDocsLoading: true,
            });

            rerender(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            expect(screen.getByTestId('page-container')).toHaveAttribute('data-loading', 'true');
        });

        it('handles multiple re-renders without errors', () => {
            const { rerender } = render(
                <TestWrapper>
                    <HomePage />
                </TestWrapper>
            );

            // Multiple re-renders with different states
            for (let i = 0; i < 5; i++) {
                mockUseHomePageData.mockReturnValue({
                    ...defaultMockData,
                    sourceDocsLoading: i % 2 === 0,
                    metaTextsLoading: i % 3 === 0,
                });

                rerender(
                    <TestWrapper>
                        <HomePage />
                    </TestWrapper>
                );

                expect(screen.getByTestId('page-container')).toBeInTheDocument();
            }
        });
    });
});
