import { useMemo } from 'react';

/**
 * Returns a filtered list of items based on a search string and a key or custom filter function.
 * @param {Array} items - The array of items to filter
 * @param {string} search - The search string
 * @param {string|function} keyOrFn - The key to filter by (default 'title'), or a custom filter function
 * @returns {Array} The filtered array
 */
export function useFilteredList(items, search, keyOrFn = 'title') {
    return useMemo(() => {
        if (!search) return items;
        if (typeof keyOrFn === 'function') {
            return items.filter(item => keyOrFn(item, search));
        }
        return items.filter(item =>
            (item[keyOrFn] || '').toLowerCase().includes(search.toLowerCase())
        );
    }, [items, search, keyOrFn]);
}
