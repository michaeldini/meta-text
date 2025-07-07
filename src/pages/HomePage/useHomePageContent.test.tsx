import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHomePageContent } from './useHomePageContent';
import { DocType, ViewMode } from '../../types';

// Mock the feature components
vi.mock('features', () => ({
    SearchableList: ({ items, filterKey, title }: any) => (
        <div data-testid="searchable-list">
            <div data-testid="list-title">{title}</div>
            <div data-testid="list-items">{JSON.stringify(items)}</div>
            <div data-testid="filter-key">{filterKey}</div>
        </div>
    ),
    CreateForm: ({ sourceDocs, sourceDocsLoading, sourceDocsError, onSuccess, docType }: any) => (
        <div data-testid="create-form">
            <div data-testid="form-doc-type">{docType}</div>
            <div data-testid="form-source-docs">{JSON.stringify(sourceDocs)}</div>
            <div data-testid="form-loading">{sourceDocsLoading.toString()}</div>
            <div data-testid="form-error">{sourceDocsError}</div>
            <button onClick={onSuccess} data-testid="form-success-trigger">
                Trigger Success
            </button>
        </div>
    ),
}));

describe('useHomePageContent', () => {
    const mockRefreshData = vi.fn();

    const defaultProps = {
        docType: DocType.MetaText,
        viewMode: ViewMode.Search,
        sourceDocs: [],
        sourceDocsLoading: false,
        sourceDocsError: null,
        metaTexts: [],
        refreshData: mockRefreshData,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Search Mode Content', () => {
        it('returns SearchableList for Search mode with MetaText', () => {
            const metaTexts = [
                { id: 1, title: 'Meta Text 1' },
                { id: 2, title: 'Meta Text 2' },
            ];

            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.MetaText,
                    viewMode: ViewMode.Search,
                    metaTexts,
                })
            );

            const element = result.current;
            expect(element.type.name).toBe('SearchableList');
            expect(element.props).toEqual({
                items: metaTexts,
                filterKey: 'title',
                title: DocType.MetaText,
            });
        });

        it('returns SearchableList for Search mode with SourceDoc', () => {
            const sourceDocs = [
                { id: 1, title: 'Source Doc 1' },
                { id: 2, title: 'Source Doc 2' },
            ];

            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.SourceDoc,
                    viewMode: ViewMode.Search,
                    sourceDocs,
                })
            );

            const element = result.current;
            expect(element.type.name).toBe('SearchableList');
            expect(element.props).toEqual({
                items: sourceDocs,
                filterKey: 'title',
                title: DocType.SourceDoc,
            });
        });

        it('passes empty array when no items available in Search mode', () => {
            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.MetaText,
                    viewMode: ViewMode.Search,
                    metaTexts: [],
                })
            );

            const element = result.current;
            expect(element.props.items).toEqual([]);
        });
    });

    describe('Create Mode Content', () => {
        it('returns CreateForm for Create mode with MetaText', () => {
            const sourceDocs = [{ id: 1, title: 'Source Doc 1' }];
            const sourceDocsError = 'Test error';

            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.MetaText,
                    viewMode: ViewMode.Create,
                    sourceDocs,
                    sourceDocsLoading: true,
                    sourceDocsError,
                })
            );

            const element = result.current;
            expect(element.type.name).toBe('CreateForm');
            expect(element.props).toEqual({
                sourceDocs,
                sourceDocsLoading: true,
                sourceDocsError,
                onSuccess: mockRefreshData,
                docType: DocType.MetaText,
            });
        });

        it('returns CreateForm for Create mode with SourceDoc', () => {
            const sourceDocs = [
                { id: 1, title: 'Doc 1' },
                { id: 2, title: 'Doc 2' },
            ];

            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.SourceDoc,
                    viewMode: ViewMode.Create,
                    sourceDocs,
                    sourceDocsLoading: false,
                    sourceDocsError: null,
                })
            );

            const element = result.current;
            expect(element.type.name).toBe('CreateForm');
            expect(element.props).toEqual({
                sourceDocs,
                sourceDocsLoading: false,
                sourceDocsError: null,
                onSuccess: mockRefreshData,
                docType: DocType.SourceDoc,
            });
        });

        it('passes all source docs related props to CreateForm', () => {
            const sourceDocs = [{ id: 1, title: 'Test Doc' }];
            const sourceDocsError = 'Load error';

            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    viewMode: ViewMode.Create,
                    sourceDocs,
                    sourceDocsLoading: true,
                    sourceDocsError,
                })
            );

            const element = result.current;
            expect(element.props.sourceDocs).toEqual(sourceDocs);
            expect(element.props.sourceDocsLoading).toBe(true);
            expect(element.props.sourceDocsError).toBe(sourceDocsError);
            expect(element.props.onSuccess).toBe(mockRefreshData);
        });
    });

    describe('Document Type Logic', () => {
        it('correctly identifies SourceDoc type in Search mode', () => {
            const sourceDocs = [{ id: 1, title: 'Source Doc' }];
            const metaTexts = [{ id: 1, title: 'Meta Text' }];

            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.SourceDoc,
                    viewMode: ViewMode.Search,
                    sourceDocs,
                    metaTexts,
                })
            );

            const element = result.current;
            expect(element.props.items).toEqual(sourceDocs);
            expect(element.props.title).toBe(DocType.SourceDoc);
        });

        it('correctly identifies MetaText type in Search mode', () => {
            const sourceDocs = [{ id: 1, title: 'Source Doc' }];
            const metaTexts = [{ id: 1, title: 'Meta Text' }];

            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.MetaText,
                    viewMode: ViewMode.Search,
                    sourceDocs,
                    metaTexts,
                })
            );

            const element = result.current;
            expect(element.props.items).toEqual(metaTexts);
            expect(element.props.title).toBe(DocType.MetaText);
        });
    });

    describe('Props Consistency', () => {
        it('maintains consistent filterKey for SearchableList', () => {
            const { result: result1 } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.MetaText,
                    viewMode: ViewMode.Search,
                })
            );

            const { result: result2 } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.SourceDoc,
                    viewMode: ViewMode.Search,
                })
            );

            expect(result1.current.props.filterKey).toBe('title');
            expect(result2.current.props.filterKey).toBe('title');
        });

        it('passes correct docType to CreateForm', () => {
            const { result: metaTextResult } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.MetaText,
                    viewMode: ViewMode.Create,
                })
            );

            const { result: sourceDocResult } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.SourceDoc,
                    viewMode: ViewMode.Create,
                })
            );

            expect(metaTextResult.current.props.docType).toBe(DocType.MetaText);
            expect(sourceDocResult.current.props.docType).toBe(DocType.SourceDoc);
        });
    });

    describe('Edge Cases', () => {
        it('handles null sourceDocs gracefully', () => {
            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.SourceDoc,
                    viewMode: ViewMode.Search,
                    sourceDocs: null as any,
                })
            );

            const element = result.current;
            expect(element.props.items).toBe(null);
        });

        it('handles null metaTexts gracefully', () => {
            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    docType: DocType.MetaText,
                    viewMode: ViewMode.Search,
                    metaTexts: null as any,
                })
            );

            const element = result.current;
            expect(element.props.items).toBe(null);
        });

        it('handles undefined refreshData function', () => {
            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    viewMode: ViewMode.Create,
                    refreshData: undefined as any,
                })
            );

            const element = result.current;
            expect(element.props.onSuccess).toBeUndefined();
        });
    });

    describe('Component Return Types', () => {
        it('returns React element for Search mode', () => {
            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    viewMode: ViewMode.Search,
                })
            );

            expect(result.current).toBeDefined();
            expect(typeof result.current).toBe('object');
            expect(result.current.type).toBeDefined();
        });

        it('returns React element for Create mode', () => {
            const { result } = renderHook(() =>
                useHomePageContent({
                    ...defaultProps,
                    viewMode: ViewMode.Create,
                })
            );

            expect(result.current).toBeDefined();
            expect(typeof result.current).toBe('object');
            expect(result.current.type).toBeDefined();
        });
    });

    describe('State Changes', () => {
        it('returns different components when viewMode changes', () => {
            const { result, rerender } = renderHook(
                ({ viewMode }) =>
                    useHomePageContent({
                        ...defaultProps,
                        viewMode,
                    }),
                { initialProps: { viewMode: ViewMode.Search } }
            );

            const searchResult = result.current;
            expect(searchResult.type.name).toBe('SearchableList');

            rerender({ viewMode: ViewMode.Create });

            const createResult = result.current;
            expect(createResult.type.name).toBe('CreateForm');
        });

        it('updates SearchableList items when docType changes', () => {
            const sourceDocs = [{ id: 1, title: 'Source Doc' }];
            const metaTexts = [{ id: 1, title: 'Meta Text' }];

            const { result, rerender } = renderHook(
                ({ docType }) =>
                    useHomePageContent({
                        ...defaultProps,
                        docType,
                        viewMode: ViewMode.Search,
                        sourceDocs,
                        metaTexts,
                    }),
                { initialProps: { docType: DocType.MetaText } }
            );

            expect(result.current.props.items).toEqual(metaTexts);

            rerender({ docType: DocType.SourceDoc });

            expect(result.current.props.items).toEqual(sourceDocs);
        });
    });
});
