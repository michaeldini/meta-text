import { useMemo } from 'react';

/**
 * Returns a filtered list of items based on a search string and a key or custom filter function.
 * @param items - The array of items to filter
 * @param search - The search string
 * @param keyOrFn - The key to filter by (default 'title'), or a custom filter function
 * @returns The filtered array
 */
export function useFilteredList<T>(
    items: T[],
    search: string,
    keyOrFn: keyof T | ((item: T, search: string) => boolean) = 'title' as keyof T
): T[] {
    return useMemo(() => {
        if (!search) return items;
        if (typeof keyOrFn === 'function') {
            return items.filter(item => keyOrFn(item, search));
        }
        return items.filter(item =>
            (String(item[keyOrFn]) || '').toLowerCase().includes(search.toLowerCase())
        );
    }, [items, search, keyOrFn]);
}
