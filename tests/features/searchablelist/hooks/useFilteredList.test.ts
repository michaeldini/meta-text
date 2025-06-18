import { renderHook } from '@testing-library/react';
import { useFilteredList } from '../../../features/searchablelist/hooks/useFilteredList';
import { describe, it, expect } from 'vitest';
import type { Item } from '../../../features/searchablelist/types';

describe('useFilteredList', () => {
    const items = [
        { id: 1, title: 'Apple', category: 'Fruit' },
        { id: 2, title: 'Banana', category: 'Fruit' },
        { id: 3, title: 'Carrot', category: 'Vegetable' },
        { id: 4, title: 'Apricot', category: 'Fruit' },
    ];

    it('returns all items when search is empty', () => {
        const { result } = renderHook(() => useFilteredList(items, ''));
        expect(result.current).toEqual(items);
    });

    it('filters by title by default', () => {
        const { result } = renderHook(() => useFilteredList(items, 'ap'));
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

    it('filters using a custom function', () => {
        const customFn = (item: typeof items[0], search: string) => item.id === 3 && search === 'carrot';
        const { result } = renderHook(() => useFilteredList(items, 'carrot', customFn));
        expect(result.current).toEqual([
            { id: 3, title: 'Carrot', category: 'Vegetable' },
        ]);
    });
});
