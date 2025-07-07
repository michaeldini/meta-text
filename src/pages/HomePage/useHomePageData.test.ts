import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useHomePageData } from './useHomePageData';
import { useDocumentsStore } from '../../store';
import { DocType, ViewMode } from '../../types';

// Mock the store
vi.mock('../../store', () => ({
    useDocumentsStore: vi.fn(),
}));

const mockUseDocumentsStore = vi.mocked(useDocumentsStore);

describe('useHomePageData', () => {
    // Mock store methods and state
    const mockFetchSourceDocs = vi.fn();
    const mockFetchMetaTexts = vi.fn();

    const mockSourceDocs = [
        { id: 1, title: 'Source Doc 1', author: 'Author 1', summary: null, characters: null, locations: null, themes: null, symbols: null },
        { id: 2, title: 'Source Doc 2', author: 'Author 2', summary: null, characters: null, locations: null, themes: null, symbols: null },
    ];

    const mockMetaTexts = [
        { id: 1, title: 'Meta Text 1', source_document_id: 1 },
        { id: 2, title: 'Meta Text 2', source_document_id: 2 },
    ];

    const createMockStore = (overrides = {}) => ({
        sourceDocs: [],
        sourceDocsLoading: false,
        sourceDocsError: null,
        metaTexts: [],
        metaTextsLoading: false,
        metaTextsError: null,
        fetchSourceDocs: mockFetchSourceDocs,
        fetchMetaTexts: mockFetchMetaTexts,
        ...overrides,
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseDocumentsStore.mockReturnValue(createMockStore());
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('initialization', () => {
        it('should return initial state with default values', () => {
            const { result } = renderHook(() => useHomePageData());

            expect(result.current.docType).toBe(DocType.MetaText);
            expect(result.current.viewMode).toBe(ViewMode.Search);
            expect(result.current.sourceDocs).toEqual([]);
            expect(result.current.sourceDocsLoading).toBe(false);
            expect(result.current.sourceDocsError).toBe(null);
            expect(result.current.metaTexts).toEqual([]);
            expect(result.current.metaTextsLoading).toBe(false);
            expect(result.current.metaTextsError).toBe(null);
            expect(typeof result.current.setDocType).toBe('function');
            expect(typeof result.current.setViewMode).toBe('function');
            expect(typeof result.current.refreshData).toBe('function');
        });

        it('should call fetchSourceDocs and fetchMetaTexts on mount', () => {
            renderHook(() => useHomePageData());

            expect(mockFetchSourceDocs).toHaveBeenCalledTimes(1);
            expect(mockFetchMetaTexts).toHaveBeenCalledTimes(1);
        });
    });

    describe('store data integration', () => {
        it('should return source docs from the store', () => {
            mockUseDocumentsStore.mockReturnValue(createMockStore({
                sourceDocs: mockSourceDocs,
            }));

            const { result } = renderHook(() => useHomePageData());

            expect(result.current.sourceDocs).toEqual(mockSourceDocs);
        });

        it('should return meta texts from the store', () => {
            mockUseDocumentsStore.mockReturnValue(createMockStore({
                metaTexts: mockMetaTexts,
            }));

            const { result } = renderHook(() => useHomePageData());

            expect(result.current.metaTexts).toEqual(mockMetaTexts);
        });

        it('should return loading states from the store', () => {
            mockUseDocumentsStore.mockReturnValue(createMockStore({
                sourceDocsLoading: true,
                metaTextsLoading: true,
            }));

            const { result } = renderHook(() => useHomePageData());

            expect(result.current.sourceDocsLoading).toBe(true);
            expect(result.current.metaTextsLoading).toBe(true);
        });

        it('should return error states from the store', () => {
            const sourceError = 'Failed to fetch source docs';
            const metaError = 'Failed to fetch meta texts';

            mockUseDocumentsStore.mockReturnValue(createMockStore({
                sourceDocsError: sourceError,
                metaTextsError: metaError,
            }));

            const { result } = renderHook(() => useHomePageData());

            expect(result.current.sourceDocsError).toBe(sourceError);
            expect(result.current.metaTextsError).toBe(metaError);
        });
    });

    describe('docType state management', () => {
        it('should allow updating docType to SourceDoc', () => {
            const { result } = renderHook(() => useHomePageData());

            act(() => {
                result.current.setDocType(DocType.SourceDoc);
            });

            expect(result.current.docType).toBe(DocType.SourceDoc);
        });

        it('should allow updating docType to MetaText', () => {
            const { result } = renderHook(() => useHomePageData());

            // First change to SourceDoc
            act(() => {
                result.current.setDocType(DocType.SourceDoc);
            });

            // Then change back to MetaText
            act(() => {
                result.current.setDocType(DocType.MetaText);
            });

            expect(result.current.docType).toBe(DocType.MetaText);
        });
    });

    describe('viewMode state management', () => {
        it('should allow updating viewMode to Create', () => {
            const { result } = renderHook(() => useHomePageData());

            act(() => {
                result.current.setViewMode(ViewMode.Create);
            });

            expect(result.current.viewMode).toBe(ViewMode.Create);
        });

        it('should allow updating viewMode to Search', () => {
            const { result } = renderHook(() => useHomePageData());

            // First change to Create
            act(() => {
                result.current.setViewMode(ViewMode.Create);
            });

            // Then change back to Search
            act(() => {
                result.current.setViewMode(ViewMode.Search);
            });

            expect(result.current.viewMode).toBe(ViewMode.Search);
        });
    });

    describe('refreshData function', () => {
        it('should call both fetchSourceDocs and fetchMetaTexts when refreshData is called', () => {
            const { result } = renderHook(() => useHomePageData());

            // Clear initial calls
            vi.clearAllMocks();

            act(() => {
                result.current.refreshData();
            });

            expect(mockFetchSourceDocs).toHaveBeenCalledTimes(1);
            expect(mockFetchMetaTexts).toHaveBeenCalledTimes(1);
        });

        it('should be memoized and not change between renders', () => {
            const { result, rerender } = renderHook(() => useHomePageData());

            const initialRefreshData = result.current.refreshData;

            rerender();

            expect(result.current.refreshData).toBe(initialRefreshData);
        });
    });

    describe('effect dependencies', () => {
        it('should not refetch data when other state changes', () => {
            const { result } = renderHook(() => useHomePageData());

            // Clear initial fetch calls
            vi.clearAllMocks();

            // Change local state - should not trigger refetch
            act(() => {
                result.current.setDocType(DocType.SourceDoc);
                result.current.setViewMode(ViewMode.Create);
            });

            expect(mockFetchSourceDocs).not.toHaveBeenCalled();
            expect(mockFetchMetaTexts).not.toHaveBeenCalled();
        });

        it('should refetch data when hook is remounted', () => {
            const { unmount } = renderHook(() => useHomePageData());

            // Clear initial fetch calls
            vi.clearAllMocks();

            unmount();

            // Remount the hook
            renderHook(() => useHomePageData());

            expect(mockFetchSourceDocs).toHaveBeenCalledTimes(1);
            expect(mockFetchMetaTexts).toHaveBeenCalledTimes(1);
        });
    });

    describe('complex state scenarios', () => {
        it('should handle multiple state updates correctly', () => {
            const { result } = renderHook(() => useHomePageData());

            act(() => {
                result.current.setDocType(DocType.SourceDoc);
                result.current.setViewMode(ViewMode.Create);
            });

            expect(result.current.docType).toBe(DocType.SourceDoc);
            expect(result.current.viewMode).toBe(ViewMode.Create);

            act(() => {
                result.current.setDocType(DocType.MetaText);
                result.current.setViewMode(ViewMode.Search);
            });

            expect(result.current.docType).toBe(DocType.MetaText);
            expect(result.current.viewMode).toBe(ViewMode.Search);
        });

        it('should maintain store data when local state changes', () => {
            mockUseDocumentsStore.mockReturnValue(createMockStore({
                sourceDocs: mockSourceDocs,
                metaTexts: mockMetaTexts,
                sourceDocsLoading: true,
                metaTextsError: 'Some error',
            }));

            const { result } = renderHook(() => useHomePageData());

            // Change local state
            act(() => {
                result.current.setDocType(DocType.SourceDoc);
                result.current.setViewMode(ViewMode.Create);
            });

            // Store data should remain unchanged
            expect(result.current.sourceDocs).toEqual(mockSourceDocs);
            expect(result.current.metaTexts).toEqual(mockMetaTexts);
            expect(result.current.sourceDocsLoading).toBe(true);
            expect(result.current.metaTextsError).toBe('Some error');
        });
    });

    describe('error handling', () => {
        it('should handle store errors gracefully', () => {
            const errorMessage = 'Network error occurred';
            mockUseDocumentsStore.mockReturnValue(createMockStore({
                sourceDocsError: errorMessage,
                metaTextsError: errorMessage,
            }));

            const { result } = renderHook(() => useHomePageData());

            expect(result.current.sourceDocsError).toBe(errorMessage);
            expect(result.current.metaTextsError).toBe(errorMessage);
            // Hook should still function normally
            expect(typeof result.current.refreshData).toBe('function');
            expect(typeof result.current.setDocType).toBe('function');
            expect(typeof result.current.setViewMode).toBe('function');
        });
    });

    describe('performance considerations', () => {
        it('should not cause unnecessary re-renders when store values do not change', () => {
            const storeValues = createMockStore({
                sourceDocs: mockSourceDocs,
                metaTexts: mockMetaTexts,
            });

            mockUseDocumentsStore.mockReturnValue(storeValues);

            const { result, rerender } = renderHook(() => useHomePageData());

            const initialResult = result.current;

            // Rerender with same store values
            rerender();

            // References should be stable
            expect(result.current.sourceDocs).toBe(initialResult.sourceDocs);
            expect(result.current.metaTexts).toBe(initialResult.metaTexts);
            expect(result.current.refreshData).toBe(initialResult.refreshData);
        });
    });
});
