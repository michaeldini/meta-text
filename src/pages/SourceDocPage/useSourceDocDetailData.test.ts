import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSourceDocDetailData } from './useSourceDocDetailData';
import { useSourceDocumentDetailStore } from '../../store';

// Mock the store
vi.mock('../../store', () => ({
    useSourceDocumentDetailStore: vi.fn(),
}));

const mockUseSourceDocumentDetailStore = vi.mocked(useSourceDocumentDetailStore);

describe('useSourceDocDetailData', () => {
    // Mock store methods and state
    const mockFetchSourceDocumentDetail = vi.fn();
    const mockClearState = vi.fn();
    const mockRefetch = vi.fn();

    const createMockStore = (overrides = {}) => ({
        doc: null,
        loading: false,
        error: '',
        fetchSourceDocumentDetail: mockFetchSourceDocumentDetail,
        clearState: mockClearState,
        refetch: mockRefetch,
        ...overrides,
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseSourceDocumentDetailStore.mockReturnValue(createMockStore());
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('initialization', () => {
        it('should return initial store state when no sourceDocId is provided', () => {
            const { result } = renderHook(() => useSourceDocDetailData());

            expect(result.current.doc).toBe(null);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe('');
            expect(typeof result.current.refetch).toBe('function');
        });

        it('should return store state with custom values', () => {
            const mockDoc = {
                id: 1,
                title: 'Test Document',
                author: 'Test Author',
                summary: 'Test Summary',
                characters: 'Test Characters',
                locations: 'Test Locations',
                themes: 'Test Themes',
                symbols: 'Test Symbols',
                text: 'Test document content',
            };

            mockUseSourceDocumentDetailStore.mockReturnValue(
                createMockStore({
                    doc: mockDoc,
                    loading: true,
                    error: 'Test error',
                })
            );

            const { result } = renderHook(() => useSourceDocDetailData('123'));

            expect(result.current.doc).toEqual(mockDoc);
            expect(result.current.loading).toBe(true);
            expect(result.current.error).toBe('Test error');
        });
    });

    describe('sourceDocId changes', () => {
        it('should call fetchSourceDocumentDetail when sourceDocId is provided', () => {
            renderHook(() => useSourceDocDetailData('123'));

            expect(mockFetchSourceDocumentDetail).toHaveBeenCalledWith('123');
            expect(mockFetchSourceDocumentDetail).toHaveBeenCalledTimes(1);
            expect(mockClearState).not.toHaveBeenCalled();
        });

        it('should call clearState when sourceDocId is undefined', () => {
            renderHook(() => useSourceDocDetailData(undefined));

            expect(mockClearState).toHaveBeenCalledTimes(1);
            expect(mockFetchSourceDocumentDetail).not.toHaveBeenCalled();
        });

        it('should call clearState when sourceDocId is empty string', () => {
            renderHook(() => useSourceDocDetailData(''));

            expect(mockClearState).toHaveBeenCalledTimes(1);
            expect(mockFetchSourceDocumentDetail).not.toHaveBeenCalled();
        });

        it('should call fetchSourceDocumentDetail with new ID when sourceDocId changes', () => {
            const { rerender } = renderHook(
                ({ sourceDocId }: { sourceDocId?: string }) => useSourceDocDetailData(sourceDocId),
                { initialProps: { sourceDocId: '123' } }
            );

            expect(mockFetchSourceDocumentDetail).toHaveBeenCalledWith('123');
            expect(mockFetchSourceDocumentDetail).toHaveBeenCalledTimes(1);

            // Change the sourceDocId
            rerender({ sourceDocId: '456' });

            expect(mockFetchSourceDocumentDetail).toHaveBeenCalledWith('456');
            expect(mockFetchSourceDocumentDetail).toHaveBeenCalledTimes(2);
        });

        it('should call clearState when sourceDocId changes from valid to undefined', () => {
            const { rerender } = renderHook(
                ({ sourceDocId }: { sourceDocId?: string }) => useSourceDocDetailData(sourceDocId),
                { initialProps: { sourceDocId: '123' as string | undefined } }
            );

            expect(mockFetchSourceDocumentDetail).toHaveBeenCalledWith('123');
            expect(mockClearState).not.toHaveBeenCalled();

            // Change to undefined
            rerender({ sourceDocId: undefined as string | undefined });

            expect(mockClearState).toHaveBeenCalledTimes(1);
        });

        it('should not call any methods when sourceDocId remains the same', () => {
            const { rerender } = renderHook(
                ({ sourceDocId }: { sourceDocId?: string }) => useSourceDocDetailData(sourceDocId),
                { initialProps: { sourceDocId: '123' } }
            );

            expect(mockFetchSourceDocumentDetail).toHaveBeenCalledTimes(1);

            // Clear mocks to test re-renders don't trigger additional calls
            vi.clearAllMocks();

            // Re-render with same sourceDocId
            rerender({ sourceDocId: '123' });

            expect(mockFetchSourceDocumentDetail).not.toHaveBeenCalled();
            expect(mockClearState).not.toHaveBeenCalled();
        });
    });

    describe('refetch function', () => {
        it('should return the refetch function from store', () => {
            const { result } = renderHook(() => useSourceDocDetailData('123'));

            expect(result.current.refetch).toBe(mockRefetch);
        });

        it('should be able to call refetch function', async () => {
            const { result } = renderHook(() => useSourceDocDetailData('123'));

            await act(async () => {
                await result.current.refetch();
            });

            expect(mockRefetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('store integration', () => {
        it('should react to store state changes', () => {
            const initialStore = createMockStore({ loading: false });
            mockUseSourceDocumentDetailStore.mockReturnValue(initialStore);

            const { result, rerender } = renderHook(() => useSourceDocDetailData('123'));

            expect(result.current.loading).toBe(false);

            // Simulate store state change
            const updatedStore = createMockStore({ loading: true });
            mockUseSourceDocumentDetailStore.mockReturnValue(updatedStore);
            rerender();

            expect(result.current.loading).toBe(true);
        });

        it('should extract correct properties from store', () => {
            const mockDoc = {
                id: 1,
                title: 'Test Document',
                author: 'Test Author',
                summary: 'Test Summary',
                characters: 'Test Characters',
                locations: 'Test Locations',
                themes: 'Test Themes',
                symbols: 'Test Symbols',
                text: 'Test document content',
            };

            const mockStore = createMockStore({
                doc: mockDoc,
                loading: true,
                error: 'Test error',
                // Include extra properties that shouldn't be returned
                currentDocId: '123',
                updateDoc: vi.fn(),
                clearError: vi.fn(),
            });

            mockUseSourceDocumentDetailStore.mockReturnValue(mockStore);

            const { result } = renderHook(() => useSourceDocDetailData('123'));

            // Should only return the expected properties
            expect(Object.keys(result.current)).toEqual(['doc', 'loading', 'error', 'refetch']);
            expect(result.current.doc).toBe(mockDoc);
            expect(result.current.loading).toBe(true);
            expect(result.current.error).toBe('Test error');
            expect(result.current.refetch).toBe(mockRefetch);
        });
    });

    describe('edge cases', () => {
        it('should handle null sourceDocId', () => {
            renderHook(() => useSourceDocDetailData(null as any));

            expect(mockClearState).toHaveBeenCalledTimes(1);
            expect(mockFetchSourceDocumentDetail).not.toHaveBeenCalled();
        });

        it('should handle whitespace-only sourceDocId as falsy', () => {
            renderHook(() => useSourceDocDetailData('   '));

            // Since the condition is just 'if (sourceDocId)', whitespace should be truthy
            expect(mockFetchSourceDocumentDetail).toHaveBeenCalledWith('   ');
            expect(mockClearState).not.toHaveBeenCalled();
        });

        it('should handle numeric sourceDocId as string', () => {
            renderHook(() => useSourceDocDetailData('123'));

            expect(mockFetchSourceDocumentDetail).toHaveBeenCalledWith('123');
            expect(mockClearState).not.toHaveBeenCalled();
        });
    });
});
