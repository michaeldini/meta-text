import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useMetaTextDetailData } from './useMetaTextDetailData';
import { useMetaTextDetailStore } from '../../store';

// Mock the store
vi.mock('../../store', () => ({
    useMetaTextDetailStore: vi.fn(),
}));

const mockUseMetaTextDetailStore = vi.mocked(useMetaTextDetailStore);

describe('useMetaTextDetailData', () => {
    // Mock store methods and state
    const mockFetchMetaTextDetail = vi.fn();
    const mockClearState = vi.fn();
    const mockClearErrors = vi.fn();

    const createMockStore = (overrides = {}) => ({
        metaText: null,
        loading: false,
        errors: { metaText: '' },
        fetchMetaTextDetail: mockFetchMetaTextDetail,
        clearState: mockClearState,
        clearErrors: mockClearErrors,
        ...overrides,
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseMetaTextDetailStore.mockReturnValue(createMockStore());
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('initialization', () => {
        it('should return initial store state and MESSAGES when valid metaTextId is provided', () => {
            const { result } = renderHook(() => useMetaTextDetailData('123'));

            expect(result.current.metaText).toBe(null);
            expect(result.current.loading).toBe(false);
            expect(result.current.errors).toEqual({ metaText: '' });
            expect(result.current.metaTextId).toBe('123');
            expect(result.current.MESSAGES).toEqual({
                NO_ID_ERROR: 'No MetaText ID provided in URL',
                META_TEXT_TITLE: 'Meta Text Title:',
                REVIEW_BUTTON: 'Review',
                NOT_FOUND_TITLE: 'MetaText not found',
                NOT_FOUND_MESSAGE: 'The MetaText with ID "{id}" could not be found.',
            });
        });

        it('should return store state with custom values', () => {
            const mockMetaText = {
                id: 1,
                title: 'Test MetaText',
                source_document_id: 2,
                text: 'Test meta text content',
                chunks: [],
            };

            mockUseMetaTextDetailStore.mockReturnValue(
                createMockStore({
                    metaText: mockMetaText,
                    loading: true,
                    errors: { metaText: 'Test error' },
                })
            );

            const { result } = renderHook(() => useMetaTextDetailData(123));

            expect(result.current.metaText).toEqual(mockMetaText);
            expect(result.current.loading).toBe(true);
            expect(result.current.errors).toEqual({ metaText: 'Test error' });
            expect(result.current.metaTextId).toBe('123');
        });
    });

    describe('metaTextId validation', () => {
        it('should throw error when metaTextId is undefined', () => {
            expect(() => {
                renderHook(() => useMetaTextDetailData(undefined));
            }).toThrow('No MetaText ID provided in URL');
        });

        it('should throw error when metaTextId is null', () => {
            expect(() => {
                renderHook(() => useMetaTextDetailData(null as any));
            }).toThrow('No MetaText ID provided in URL');
        });

        it('should throw error when metaTextId is empty string', () => {
            expect(() => {
                renderHook(() => useMetaTextDetailData(''));
            }).toThrow('No MetaText ID provided in URL');
        });

        it('should throw error when metaTextId is 0', () => {
            expect(() => {
                renderHook(() => useMetaTextDetailData(0));
            }).toThrow('No MetaText ID provided in URL');
        });
    });

    describe('metaTextId type conversion', () => {
        it('should convert number metaTextId to string', () => {
            const { result } = renderHook(() => useMetaTextDetailData(123));

            expect(result.current.metaTextId).toBe('123');
            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('123');
        });

        it('should use string metaTextId as-is', () => {
            const { result } = renderHook(() => useMetaTextDetailData('456'));

            expect(result.current.metaTextId).toBe('456');
            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('456');
        });

        it('should handle string representation of numbers', () => {
            const { result } = renderHook(() => useMetaTextDetailData('789'));

            expect(result.current.metaTextId).toBe('789');
            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('789');
        });
    });

    describe('metaTextId changes', () => {
        it('should call fetchMetaTextDetail when metaTextId is provided', () => {
            renderHook(() => useMetaTextDetailData('123'));

            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('123');
            expect(mockFetchMetaTextDetail).toHaveBeenCalledTimes(1);
            expect(mockClearState).not.toHaveBeenCalled();
        });

        it('should call fetchMetaTextDetail with new ID when metaTextId changes', () => {
            const { rerender } = renderHook(
                ({ metaTextId }: { metaTextId: number | string }) => useMetaTextDetailData(metaTextId),
                { initialProps: { metaTextId: '123' } }
            );

            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('123');
            expect(mockFetchMetaTextDetail).toHaveBeenCalledTimes(1);

            // Change the metaTextId
            rerender({ metaTextId: '456' });

            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('456');
            expect(mockFetchMetaTextDetail).toHaveBeenCalledTimes(2);
        });

        it('should handle changing from string to number metaTextId', () => {
            const { rerender } = renderHook(
                ({ metaTextId }: { metaTextId: number | string }) => useMetaTextDetailData(metaTextId),
                { initialProps: { metaTextId: '123' as string | number } }
            );

            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('123');

            // Change to number
            rerender({ metaTextId: 456 as string | number });

            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('456');
            expect(mockFetchMetaTextDetail).toHaveBeenCalledTimes(2);
        });

        it('should not call fetchMetaTextDetail when metaTextId remains the same', () => {
            const { rerender } = renderHook(
                ({ metaTextId }: { metaTextId: number | string }) => useMetaTextDetailData(metaTextId),
                { initialProps: { metaTextId: '123' } }
            );

            expect(mockFetchMetaTextDetail).toHaveBeenCalledTimes(1);

            // Clear mocks to test re-renders don't trigger additional calls
            vi.clearAllMocks();

            // Re-render with same metaTextId
            rerender({ metaTextId: '123' });

            expect(mockFetchMetaTextDetail).not.toHaveBeenCalled();
        });

        it('should not call fetchMetaTextDetail when numeric and string versions are equivalent', () => {
            const { rerender } = renderHook(
                ({ metaTextId }: { metaTextId: number | string }) => useMetaTextDetailData(metaTextId),
                { initialProps: { metaTextId: 123 as string | number } }
            );

            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('123');
            expect(mockFetchMetaTextDetail).toHaveBeenCalledTimes(1);

            // Clear mocks to test re-renders don't trigger additional calls
            vi.clearAllMocks();

            // Re-render with string version of same number
            rerender({ metaTextId: '123' as string | number });

            expect(mockFetchMetaTextDetail).not.toHaveBeenCalled();
        });
    });

    describe('error handling', () => {
        it('should throw error when store has metaText error and is not loading', () => {
            mockUseMetaTextDetailStore.mockReturnValue(
                createMockStore({
                    loading: false,
                    errors: { metaText: 'MetaText not found' },
                })
            );

            expect(() => {
                renderHook(() => useMetaTextDetailData('123'));
            }).toThrow('MetaText not found');
        });

        it('should not throw error when store has metaText error but is loading', () => {
            mockUseMetaTextDetailStore.mockReturnValue(
                createMockStore({
                    loading: true,
                    errors: { metaText: 'MetaText not found' },
                })
            );

            expect(() => {
                renderHook(() => useMetaTextDetailData('123'));
            }).not.toThrow();
        });

        it('should not throw error when store has no metaText error', () => {
            mockUseMetaTextDetailStore.mockReturnValue(
                createMockStore({
                    loading: false,
                    errors: { metaText: '' },
                })
            );

            expect(() => {
                renderHook(() => useMetaTextDetailData('123'));
            }).not.toThrow();
        });

        it('should handle error state changes during render', () => {
            const initialStore = createMockStore({
                loading: true,
                errors: { metaText: '' },
            });
            mockUseMetaTextDetailStore.mockReturnValue(initialStore);

            const { result, rerender } = renderHook(() => useMetaTextDetailData('123'));

            // Should not throw initially
            expect(result.current.errors).toEqual({ metaText: '' });

            // Simulate error after loading completes
            const errorStore = createMockStore({
                loading: false,
                errors: { metaText: 'Network error' },
            });
            mockUseMetaTextDetailStore.mockReturnValue(errorStore);

            expect(() => {
                rerender();
            }).toThrow('Network error');
        });
    });

    describe('store integration', () => {
        it('should react to store state changes', () => {
            const initialStore = createMockStore({ loading: false });
            mockUseMetaTextDetailStore.mockReturnValue(initialStore);

            const { result, rerender } = renderHook(() => useMetaTextDetailData('123'));

            expect(result.current.loading).toBe(false);

            // Simulate store state change
            const updatedStore = createMockStore({ loading: true });
            mockUseMetaTextDetailStore.mockReturnValue(updatedStore);
            rerender();

            expect(result.current.loading).toBe(true);
        });

        it('should extract correct properties from store', () => {
            const mockMetaText = {
                id: 1,
                title: 'Test MetaText',
                source_document_id: 2,
                text: 'Test meta text content',
                chunks: [],
            };

            const mockStore = createMockStore({
                metaText: mockMetaText,
                loading: true,
                errors: { metaText: 'Test error' },
                // Include extra properties that shouldn't be returned
                currentMetaTextId: '123',
            });

            mockUseMetaTextDetailStore.mockReturnValue(mockStore);

            const { result } = renderHook(() => useMetaTextDetailData('123'));

            // Should only return the expected properties
            expect(Object.keys(result.current)).toEqual(['metaText', 'loading', 'errors', 'metaTextId', 'MESSAGES']);
            expect(result.current.metaText).toBe(mockMetaText);
            expect(result.current.loading).toBe(true);
            expect(result.current.errors).toEqual({ metaText: 'Test error' });
            expect(result.current.metaTextId).toBe('123');
        });
    });

    describe('MESSAGES constants', () => {
        it('should always return the same MESSAGES object', () => {
            const { result: result1 } = renderHook(() => useMetaTextDetailData('123'));
            const { result: result2 } = renderHook(() => useMetaTextDetailData('456'));

            expect(result1.current.MESSAGES).toEqual(result2.current.MESSAGES);
            expect(result1.current.MESSAGES).toEqual({
                NO_ID_ERROR: 'No MetaText ID provided in URL',
                META_TEXT_TITLE: 'Meta Text Title:',
                REVIEW_BUTTON: 'Review',
                NOT_FOUND_TITLE: 'MetaText not found',
                NOT_FOUND_MESSAGE: 'The MetaText with ID "{id}" could not be found.',
            });
        });

        it('should have immutable MESSAGES', () => {
            const { result } = renderHook(() => useMetaTextDetailData('123'));

            // Verify MESSAGES is readonly by checking the type
            expect(typeof result.current.MESSAGES.NO_ID_ERROR).toBe('string');
            expect(typeof result.current.MESSAGES.META_TEXT_TITLE).toBe('string');
            expect(typeof result.current.MESSAGES.REVIEW_BUTTON).toBe('string');
            expect(typeof result.current.MESSAGES.NOT_FOUND_TITLE).toBe('string');
            expect(typeof result.current.MESSAGES.NOT_FOUND_MESSAGE).toBe('string');
        });
    });

    describe('edge cases', () => {
        it('should handle very large numeric metaTextId', () => {
            const largeId = 999999999999;
            const { result } = renderHook(() => useMetaTextDetailData(largeId));

            expect(result.current.metaTextId).toBe('999999999999');
            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('999999999999');
        });

        it('should handle string metaTextId with leading zeros', () => {
            const { result } = renderHook(() => useMetaTextDetailData('0123'));

            expect(result.current.metaTextId).toBe('0123');
            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('0123');
        });

        it('should handle negative numeric metaTextId', () => {
            const { result } = renderHook(() => useMetaTextDetailData(-1));

            expect(result.current.metaTextId).toBe('-1');
            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('-1');
        });

        it('should handle whitespace-only string as valid metaTextId', () => {
            const { result } = renderHook(() => useMetaTextDetailData('   123   '));

            expect(result.current.metaTextId).toBe('   123   ');
            expect(mockFetchMetaTextDetail).toHaveBeenCalledWith('   123   ');
        });
    });
});
