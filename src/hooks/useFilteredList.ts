// import { useMemo } from 'react';

// export function useFilteredList<T>(
//     items: T[],
//     search: string,
//     keyOrFn?: keyof T | ((item: T, search: string) => boolean)
// ): T[] {
//     return useMemo(() => {
//         if (!search || !search.trim()) return items;

//         if (typeof keyOrFn === 'function') {
//             return items.filter(item => keyOrFn(item, search));
//         }

//         if (keyOrFn && typeof keyOrFn !== 'function') {
//             return items.filter(item => {
//                 const value = item[keyOrFn];
//                 if (value == null) return false;
//                 return String(value).toLowerCase().includes(search.toLowerCase().trim());
//             });
//         }

//         // Fallback: search all string properties if no key specified
//         return items.filter(item => {
//             return Object.values(item as Record<string, any>).some(value => {
//                 if (typeof value === 'string') {
//                     return value.toLowerCase().includes(search.toLowerCase().trim());
//                 }
//                 return false;
//             });
//         });
//     }, [items, search, keyOrFn]);
// }
