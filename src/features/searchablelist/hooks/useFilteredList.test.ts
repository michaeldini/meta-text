import { renderHook } from '@testing-library/react';
import { useFilteredList } from './useFilteredList';
import { describe, it, expect } from 'vitest';

interface Item {
    id: number;
    title: string;
    category: string;
    description?: string;
}

describe('useFilteredList', () => {
    const items: Item[] = [
        { id: 1, title: 'Apple', category: 'Fruit' },
        { id: 2, title: 'Banana', category: 'Fruit' },
        { id: 3, title: 'Carrot', category: 'Vegetable' },
        { id: 4, title: 'Apricot', category: 'Fruit' },
        { id: 5, title: 'Broccoli', category: 'Vegetable', description: 'Green vegetable' },
    ];

    describe('Basic Functionality', () => {
        it('returns all items when search is empty', () => {
            const { result } = renderHook(() => useFilteredList(items, ''));
            expect(result.current).toEqual(items);
        });

        it('returns all items when search is only whitespace', () => {
            const { result } = renderHook(() => useFilteredList(items, '   '));
            expect(result.current).toEqual(items);
        });

        it('filters by specific key', () => {
            const { result } = renderHook(() => useFilteredList(items, 'ap', 'title'));
            expect(result.current).toEqual([
                { id: 1, title: 'Apple', category: 'Fruit' },
                { id: 4, title: 'Apricot', category: 'Fruit' },
            ]);
        });

        it('filters by custom key', () => {
            const { result } = renderHook(() => useFilteredList(items, 'fruit', 'category'));
            expect(result.current).toEqual([
                { id: 1, title: 'Apple', category: 'Fruit' },
                { id: 2, title: 'Banana', category: 'Fruit' },
                { id: 4, title: 'Apricot', category: 'Fruit' },
            ]);
        });

        it('searches all string properties when no key specified', () => {
            const { result } = renderHook(() => useFilteredList(items, 'green'));
            expect(result.current).toEqual([
                { id: 5, title: 'Broccoli', category: 'Vegetable', description: 'Green vegetable' },
            ]);
        });
    });

    describe('Custom Filter Function', () => {
        it('filters using a custom function', () => {
            const customFn = (item: Item, search: string) =>
                item.id === 3 && search.toLowerCase() === 'carrot';
            const { result } = renderHook(() => useFilteredList(items, 'carrot', customFn));
            expect(result.current).toEqual([
                { id: 3, title: 'Carrot', category: 'Vegetable' },
            ]);
        });

        it('returns empty array when custom function returns false', () => {
            const customFn = () => false;
            const { result } = renderHook(() => useFilteredList(items, 'anything', customFn));
            expect(result.current).toEqual([]);
        });

        it('filters with complex custom logic', () => {
            const customFn = (item: Item, search: string) => {
                const searchLower = search.toLowerCase();
                return item.title.toLowerCase().includes(searchLower) &&
                    item.category === 'Fruit';
            };
            const { result } = renderHook(() => useFilteredList(items, 'a', customFn));
            expect(result.current).toEqual([
                { id: 1, title: 'Apple', category: 'Fruit' },
                { id: 2, title: 'Banana', category: 'Fruit' },
                { id: 4, title: 'Apricot', category: 'Fruit' },
            ]);
        });
    });

    describe('Edge Cases', () => {
        it('handles empty items array', () => {
            const { result } = renderHook(() => useFilteredList([], 'test'));
            expect(result.current).toEqual([]);
        });

        it('handles null/undefined values in filter key', () => {
            const itemsWithNulls = [
                { id: 1, title: 'Valid', category: 'Fruit' },
                { id: 2, title: null as any, category: 'Fruit' },
                { id: 3, title: undefined as any, category: 'Fruit' },
            ];
            const { result } = renderHook(() => useFilteredList(itemsWithNulls, 'valid', 'title'));
            expect(result.current).toEqual([
                { id: 1, title: 'Valid', category: 'Fruit' },
            ]);
        });

        it('is case insensitive', () => {
            const { result } = renderHook(() => useFilteredList(items, 'APPLE', 'title'));
            expect(result.current).toEqual([
                { id: 1, title: 'Apple', category: 'Fruit' },
            ]);
        });

        it('trims search string', () => {
            const { result } = renderHook(() => useFilteredList(items, '  apple  ', 'title'));
            expect(result.current).toEqual([
                { id: 1, title: 'Apple', category: 'Fruit' },
            ]);
        });

        it('handles non-string property values', () => {
            const itemsWithNumbers = [
                { id: 1, title: 'Item 1', score: 100 },
                { id: 2, title: 'Item 2', score: 200 },
            ];
            const { result } = renderHook(() => useFilteredList(itemsWithNumbers, '100', 'score' as keyof typeof itemsWithNumbers[0]));
            expect(result.current).toEqual([
                { id: 1, title: 'Item 1', score: 100 },
            ]);
        });
    });

    describe('Performance and Re-rendering', () => {
        it('memoizes results correctly', () => {
            const { result, rerender } = renderHook(
                ({ search, key }) => useFilteredList(items, search, key),
                { initialProps: { search: 'apple', key: 'title' as keyof Item } }
            );

            const firstResult = result.current;

            // Re-render with same props
            rerender({ search: 'apple', key: 'title' as keyof Item });

            // Should return the same reference (memoized)
            expect(result.current).toBe(firstResult);
        });

        it('updates when dependencies change', () => {
            const { result, rerender } = renderHook(
                ({ search, key }) => useFilteredList(items, search, key),
                { initialProps: { search: 'apple', key: 'title' as keyof Item } }
            );

            const firstResult = result.current;

            // Re-render with different search
            rerender({ search: 'banana', key: 'title' as keyof Item });

            // Should return different result
            expect(result.current).not.toBe(firstResult);
            expect(result.current).toEqual([
                { id: 2, title: 'Banana', category: 'Fruit' },
            ]);
        });
    });
});
